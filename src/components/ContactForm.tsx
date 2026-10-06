import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  // Optional subject prefill, e.g. /contact?subject=Privacy%20request from the legal pages
  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get('subject');
    if (subject) setFormData((d) => ({ ...d, subject: subject.slice(0, 120) }));
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const a11y = (field: keyof ContactFormData) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Enter your name.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Keep your name under 100 characters.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Enter your email address so we can reply.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address, like name@example.com.';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Add a short subject.';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Keep the subject under 200 characters.';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Write your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Add a little more detail (10 characters minimum).';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Keep the message under 2000 characters.';
    }
    
    setErrors(newErrors);
    // Move focus to the first field that needs fixing
    const firstInvalid = (['name', 'email', 'subject', 'message'] as const).find((f) => newErrors[f]);
    if (firstInvalid) document.getElementById(firstInvalid)?.focus();
    return !firstInvalid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          honeypot: honeypotRef.current?.value ?? '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', text: data.error || 'Your message could not be sent. Please try again.' });
        return;
      }

      setStatus({ kind: 'ok', text: 'Message sent. We usually reply within a few business days.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ kind: 'error', text: 'Network error. Check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Contact Form */}
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
        {status && (
          <div
            role="status"
            className={`mb-6 rounded-md px-4 py-3 text-sm ${
              status.kind === 'ok' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'
            }`}
          >
            {status.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative space-y-6" noValidate>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...a11y("name")}
                autoComplete="name"
                maxLength={100}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...a11y("email")}
                autoComplete="email"
                maxLength={254}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...a11y("subject")}
              maxLength={200}
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className={errors.subject ? 'border-destructive' : ''}
            />
            {errors.subject && <p id="subject-error" className="text-sm text-destructive">{errors.subject}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...a11y("message")}
              maxLength={2000}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="What do you need help with?"
              rows={6}
              className={errors.message ? 'border-destructive' : ''}
            />
            <div className="flex justify-between gap-4">
              {errors.message ? (
                <p id="message-error" className="text-sm text-destructive">{errors.message}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground tabular-nums" aria-hidden="true">
                {formData.message.length}/2000
              </span>
            </div>
          </div>
          
          {/* Honeypot: invisible to humans, bots fill it in */}
          <div className="absolute -top-96 left-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              ref={honeypotRef}
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
