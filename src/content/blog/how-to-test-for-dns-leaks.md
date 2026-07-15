---
title: 'How to Test for DNS Leaks: Complete Guide to Finding and Fixing DNS Privacy Failures'
description: 'A DNS leak silently exposes your browsing activity to your ISP even when using a VPN. Learn how to detect, diagnose, and fix DNS leaks on any platform with step-by-step instructions and free tools.'
publishedAt: 2026-07-15
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop'
tags: ['dns leak', 'vpn privacy', 'network security', 'dns security']
draft: false
---

## Introduction: The Privacy Threat Your VPN Cannot Stop

You have connected to a VPN. Your IP address is hidden, your traffic is encrypted, and your ISP cannot see which websites you visit. Or so you think.

The reality is more nuanced. Even with a reputable VPN provider, a **DNS leak** can silently expose your browsing activity to your ISP or a third-party DNS resolver — defeating the entire purpose of using a VPN for privacy. DNS leaks are among the most common and overlooked privacy failures on the internet today.

The dangerous part? There is no popup, no warning, and no error message. Your VPN appears to work normally while your DNS queries — and therefore your browsing history — leak in plain sight.

This guide covers what DNS leaks are, how to test for them, why they happen, and how to fix them on every major platform.

## What Is a DNS Leak?

Every time you type a domain name like `example.com`, your browser needs to find the corresponding IP address. That process — translating human-readable names into machine-readable addresses — relies on the **Domain Name System (DNS)**.

DNS is essentially the internet's phone book. When you visit a website, your device performs a DNS lookup to find the correct server address before making the connection.

Normally, this lookup is handled by your **ISP's DNS servers** by default. Your ISP can see every domain you request, even if the actual traffic is encrypted. This is why privacy-conscious users route DNS through their VPN tunnel — to prevent the ISP from logging their browsing activity.

A **DNS leak** occurs when this lookup bypasses your VPN's encrypted tunnel and goes directly to your ISP's DNS servers (or another third-party resolver). Your IP address may stay hidden, but your DNS queries are exposed.

## Why DNS Leaks Happen

Understanding the root causes helps you diagnose and fix leaks permanently.

### 1. Incomplete VPN Tunnel Configuration

Some VPN clients only route traffic through the tunnel selectively. Legacy VPN protocols and certain split-tunneling configurations can leave DNS resolution outside the encrypted path.

### 2. IPv6 Without Proper Handling

Many ISPs now support IPv6. If your VPN does not handle IPv6 DNS queries properly, they can leak over your regular network connection while IPv4 traffic goes through the VPN.

### 3. Default DNS Assignments at the OS Level

Operating systems maintain a DNS resolver cache and have their own priority rules. Even when your VPN connects, the OS may fall back to its default DNS settings for certain queries.

### 4. Teredo and Dual-Stack Tunnels

Microsoft Windows includes Teredo tunneling technology to help IPv6 connectivity in dual-stack environments. Teredo can interfere with VPN DNS routing and cause leaks on Windows systems.

### 5. Split Tunneling Misconfiguration

When you configure split tunneling to exclude certain applications from the VPN, DNS resolution for those excluded apps may use your default ISP DNS rather than the VPN's.

## How to Test for a DNS Leak

Testing is straightforward. You need a reliable DNS leak testing service and a clear understanding of what to look for.

### Method 1: Use a DNS Leak Test Website

The easiest method uses an online DNS leak test.

**Step-by-step:**

1. Disconnect your VPN and note the DNS servers shown (these should be your ISP's servers).
2. Connect to your VPN.
3. Visit a DNS leak test site — `ipleak.net` is reliable and shows real-time results.
4. Click **"Immediate DNS leak test"** or let it run for 30 seconds.
5. Check the results carefully.

**What to look for in the results:**

- **Your ISP's DNS servers appearing** → You have a leak.
- **Only your VPN provider's DNS servers** → No leak detected.
- **A mix of both** → Partial leak (some queries are leaking).

If your ISP's DNS servers appear after connecting to the VPN, you have a leak regardless of whether your browsing otherwise appears private.

### Method 2: Manual Command-Line Testing

For a deeper diagnostic, use your terminal to query DNS directly.

**On macOS and Linux:**
```bash
# Query DNS through your current resolver
nslookup example.com

# Force a query to a specific DNS server (e.g., Google DNS)
nslookup example.com 8.8.8.8

# Use dig for more detailed output
dig example.com @8.8.8.8 +short
```

**On Windows (PowerShell):**
```powershell
# Query your current DNS settings
Resolve-DnsName example.com

# Query a specific DNS server
Resolve-DnsName example.com -Server 8.8.8.8
```

**What to look for:**
If the nameservers returned by your default resolver do not match the DNS servers provided by your VPN, you have a configuration issue. Compare the nameservers shown when your VPN is disconnected versus connected.

### Method 3: Use `dnsleaktest.com` via CLI

For scripted or repeated testing, use `curl` to hit the test endpoint:

```bash
curl -s https://api.dnsleaktest.com/v2/info
curl -s https://api.dnsleaktest.com/v2/lookup?domain=example.com
```

This returns JSON with the DNS servers that handled your queries. If these do not belong to your VPN provider, you have a leak.

## How to Fix DNS Leaks

Once you have identified a leak, fix it systematically. Here are the most effective solutions for each platform and cause.

### Fix 1: Configure Your VPN Client Correctly

Your first line of defense is proper VPN configuration.

- **Enable the VPN's DNS leak protection** — most reputable VPN apps include a built-in option. Enable it in settings.
- **Force all DNS traffic through the VPN tunnel** — some VPN clients call this "block IPv6 DNS" or "use VPN DNS only."
- **Avoid split tunneling for DNS-critical applications** — if you exclude your browser from the tunnel for performance reasons, your DNS queries for those sessions will leak.

### Fix 2: Set DNS Servers Manually at the OS Level

Manually configuring DNS at the operating system level removes your ISP's DNS servers as a fallback option.

**On Windows:**

1. Open **Control Panel → Network and Sharing Center → Change adapter settings**.
2. Right-click your VPN connection → **Properties**.
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**.
4. Choose **"Use the following DNS server addresses."**
5. Enter your VPN provider's DNS addresses (e.g., `10.0.0.1` or a private address) or a privacy-focused public DNS like `1.1.1.1` (Cloudflare) or `9.9.9.9` (Quad9).
6. Click **OK** and close all windows.

**On macOS:**

1. Go to **System Preferences → Network**.
2. Select your active VPN connection → **Advanced**.
3. Go to the **DNS** tab.
4. Remove any ISP DNS servers listed.
5. Add your VPN's recommended DNS servers or privacy-focused alternatives.
6. Click **OK** → **Apply**.

**On Linux (systemd-resolved):**

```bash
# Check your current DNS configuration
resolvectl status

# Edit the systemd-resolved configuration
sudo nano /etc/systemd/resolved.conf
```

Add or update:
```ini
[Resolve]
DNS=10.0.0.1        # Replace with your VPN's DNS
DNSOverTLS=yes
Domains=~.
```

Then restart the service:
```bash
sudo systemctl restart systemd-resolved
```

### Fix 3: Disable Teredo on Windows

Teredo tunneling can bypass your VPN's DNS tunnel on Windows systems.

**Via PowerShell (run as Administrator):**
```powershell
# Disable Teredo
netsh interface teredo set state disabled

# Verify it is disabled
netsh interface teredo show state
```

**To re-enable if needed:**
```powershell
netsh interface teredo set state client
```

### Fix 4: Block IPv6 Completely

If your VPN does not handle IPv6 DNS queries, the safest approach is to block IPv6 entirely while the VPN is active.

**On Linux with iptables:**

```bash
# Block incoming IPv6
sudo ip6tables -I INPUT -j DROP
sudo ip6tables -I OUTPUT -j DROP

# Verify IPv6 is blocked
ip6tables -L -v -n
```

**On macOS:**

1. Go to **System Preferences → Network**.
2. Select your active network connection → **Advanced**.
3. Go to the **TCP/IP** tab.
4. Set **Configure IPv6** to **"Off."**
5. Apply and reconnect your VPN.

### Fix 5: Use a DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT) Client

Encrypting your DNS queries end-to-end adds an additional layer of protection even if a leak occurs.

Popular encrypted DNS providers:

| Provider | DoH URL | DoT Hostname |
|---|---|---|
| Cloudflare | `https://cloudflare-dns.com/dns-query` | `cloudflare-dns.com` |
| Quad9 | `https://dns.quad9.net/dns-query` | `dns.quad9.net` |
| Google | `https://dns.google/dns-query` | `dns.google` |
| NextDNS | `https://dns.nextdns.io/dns-query` | `dns.nextdns.io` |

**On Firefox (browser-level DoH):**

1. Open Firefox → **Settings → General → Network Settings** → **Settings**.
2. Check **"Enable DNS over HTTPS."**
3. Choose a provider or enter a custom DoH URL.
4. Click **OK**.

Note: Browser-level DoH encrypts DNS within Firefox only. It does not protect DNS from other applications. For full-system protection, configure DoH/DoT at the OS or router level.

## How to Verify Your Fix

After applying any fix:

1. **Reconnect your VPN** fresh.
2. **Clear your browser cache** and DNS cache:
   - **Windows:** `ipconfig /flushdns`
   - **macOS:** `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - **Linux:** `sudo systemd-resolve --flush-caches`
3. **Run the DNS leak test again** on `ipleak.net`.
4. Confirm that only your VPN's DNS servers appear — not your ISP's.

## Common Misconceptions About DNS Leaks

**"If my VPN has a no-logs policy, DNS leaks do not matter."**

Wrong. A no-logs policy means your VPN provider does not store your DNS queries on their servers. But if those queries are leaking to your ISP in the first place, the no-logs policy is irrelevant — your ISP is logging them directly.

**"Using incognito mode hides DNS queries."**

Incognito mode only prevents local browsing history from being stored on your device. DNS queries still go through the system resolver and can leak.

**"Free VPNs do not have DNS leaks."**

Free VPNs are among the worst offenders. Many lack the infrastructure to operate their own DNS servers and default to Google DNS or their ISP's DNS — completely defeating the privacy purpose. Always verify with a leak test regardless of what VPN you use.

## Summary: DNS Leak Checklist

- [ ] Run a DNS leak test with your VPN connected (visit `ipleak.net`)
- [ ] Confirm only your VPN provider's DNS servers appear in results
- [ ] Enable DNS leak protection in your VPN client settings
- [ ] Manually configure DNS servers at the OS level as a backup
- [ ] Disable Teredo on Windows systems
- [ ] Consider IPv6 blocking if your VPN does not handle it
- [ ] Use DNS-over-HTTPS or DNS-over-TLS for encrypted DNS resolution
- [ ] Re-test after any network or VPN configuration change

DNS leaks are silent but fixable. Run a test now — if your ISP's servers appear, you have a leak worth fixing before your next browsing session.
