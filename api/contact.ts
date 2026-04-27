import { Resend } from 'resend';

// ---------------------------------------------------------------------------
// Rate limiting (in-memory — resets on cold start, acceptable for a contact form)
// For high-traffic production use, replace with Vercel KV or Upstash Redis.
// ---------------------------------------------------------------------------
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;            // max 3 submissions per IP per hour

function getClientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].trim();
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// HTML escaping — prevents XSS in the email body
// ---------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------------
// Email template
// ---------------------------------------------------------------------------
function buildEmailHtml(fields: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const name = escapeHtml(fields.name);
  const email = escapeHtml(fields.email);
  const subject = escapeHtml(fields.subject);
  const message = escapeHtml(fields.message).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#374151;max-width:600px;margin:0 auto;padding:24px;background:#fff">
  <h2 style="color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:12px;margin-bottom:20px">
    New Contact Form Submission
  </h2>
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <td style="padding:8px 16px 8px 0;font-weight:600;color:#6b7280;width:80px;vertical-align:top">From</td>
      <td style="padding:8px 0">${name} &lt;<a href="mailto:${email}" style="color:#4f46e5">${email}</a>&gt;</td>
    </tr>
    <tr>
      <td style="padding:8px 16px 8px 0;font-weight:600;color:#6b7280;vertical-align:top">Subject</td>
      <td style="padding:8px 0">${subject}</td>
    </tr>
  </table>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-top:20px;border:1px solid #e5e7eb">
    <p style="margin:0;white-space:pre-wrap;line-height:1.6">${message}</p>
  </div>
  <p style="margin-top:24px;color:#9ca3af;font-size:12px">Sent via ippriv.com contact form</p>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, subject, message, honeypot } = req.body ?? {};

  // Honeypot: bots fill hidden fields, real users don't
  if (honeypot) {
    // Silently accept — don't reveal that we detected a bot
    return res.status(200).json({ success: true });
  }

  // Server-side validation (never trust client-side alone)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (typeof email !== 'string' || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (typeof subject !== 'string' || !subject.trim() || subject.trim().length > 200) {
    return res.status(400).json({ error: 'Invalid subject' });
  }
  if (
    typeof message !== 'string' ||
    message.trim().length < 10 ||
    message.trim().length > 2000
  ) {
    return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' });
  }

  try {
    const { error } = await resend.emails.send({
      from: 'IPPriv Contact <contact@mxtoolbox.eu>',
      to: ['ippriv@visbran.mozmail.com'],
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      html: buildEmailHtml({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }),
    });

    if (error) {
      console.error('[contact] Resend error:', error.message);
      return res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
