---
title: 'DNS Leak Test: How to Detect If Your DNS Queries Are Exposed'
description: 'Learn what a DNS leak is, why it compromises your privacy even with a VPN, and how to run a DNS leak test with code examples and CLI tools.'
publishedAt: 2026-05-02
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop'
tags: ['DNS', 'Privacy', 'VPN', 'Security', 'Network']
draft: false
---

When you use a VPN, you expect all your internet traffic to be tunneled through the VPN provider's servers—masking your real IP address and keeping your browsing private. But there's a critical flaw that can expose your DNS queries, betraying your activity even when the VPN connection appears secure. This phenomenon is called a **DNS leak**.

In this guide, you'll learn what DNS leaks are, how they happen, how to test for them, and how to prevent them.

## What Is a DNS Leak?

Every time you type a domain name like `google.com`, your browser needs to translate it into an IP address. This translation happens through the **Domain Name System (DNS)**—a distributed database that acts as the internet's phone book.

Normally, your device sends DNS requests to your **Internet Service Provider's (ISP)** DNS servers. When you connect to a VPN, these requests should be routed through the VPN tunnel to the provider's DNS servers instead. A **DNS leak** occurs when these requests bypass the VPN and are sent directly to your ISP's servers—leaking information about your browsing activity.

### Why Does This Matter?

Even if your VPN hides your IP address, your ISP can still see:

- Every domain you visit
- The times you访问 certain sites
- Your general browsing patterns

This defeats much of the purpose of using a VPN for privacy. For journalists, researchers, or anyone operating under restrictive networks, a DNS leak can be dangerous.

## How DNS Leaks Happen

DNS leaks typically occur due to:

1. **IPv6 without VPN handling** — Many networks have IPv6 enabled. If your VPN doesn't handle IPv6 traffic, your device may fall back to making DNS requests over IPv6 directly to your ISP.

2. **Windows split tunneling** — Windows may send certain traffic (like local network devices or Microsoft services) outside the VPN tunnel.

3. **Manual DNS settings** — If your network adapter has statically configured DNS servers pointing to your ISP, the VPN may not override them.

4. **VPN software bugs** — Some VPN clients have configuration issues that fail to properly route all DNS traffic.

## How to Run a DNS Leak Test

### Method 1: Online DNS Leak Test

The simplest method is using an online tool like [dnsleaktest.com](https://dnsleaktest.com) or [ipleak.net](https://ipleak.net). These services display the DNS servers resolving your queries in real-time.

### Method 2: Command Line DNS Leak Test

For a more technical approach, you can query DNS servers directly:

```bash
# Using dig to query DNS through a specific server
dig @resolver1.opendns.com myip.opendns.com +short

# Check what DNS server is currently being used
scutil --dns | grep 'nameserver'
```

On Linux:
```bash
# View current DNS configuration
cat /etc/resolv.conf

# Query your visible DNS with dig
dig +short myip.opendns.com @208.67.222.222
```

### Method 3: Python Script for DNS Leak Detection

Here's a practical script to detect potential DNS leaks:

```python
#!/usr/bin/env python3
"""
DNS Leak Test Script
Checks which DNS servers are resolving your queries.
"""

import socket
import subprocess
from typing import List, Dict

# Known DNS provider IPs (for comparison)
KNOWN_DNS_PROVIDERS = {
    "208.67.222.222": "OpenDNS",
    "208.67.220.220": "OpenDNS",
    "1.1.1.1": "Cloudflare",
    "1.0.0.1": "Cloudflare",
    "8.8.8.8": "Google",
    "8.8.4.4": "Google",
    "9.9.9.9": "Quad9",
}

def get_dns_servers() -> List[str]:
    """Get current DNS servers using system commands."""
    try:
        # Try to read from /etc/resolv.conf on Unix
        with open('/etc/resolv.conf', 'r') as f:
            servers = []
            for line in f:
                if line.strip().startswith('nameserver'):
                    parts = line.split()
                    if len(parts) >= 2:
                        servers.append(parts[1])
            return servers
    except (FileNotFoundError, PermissionError):
        pass
    
    # Fallback: use scutil for macOS
    try:
        result = subprocess.run(
            ['scutil', '--dns'],
            capture_output=True,
            text=True
        )
        servers = []
        for line in result.stdout.split('\n'):
            if 'nameserver' in line.lower():
                parts = line.split(':')
                if len(parts) >= 2:
                    servers.append(parts[1].strip())
        return servers
    except:
        return []

def check_dns_leak() -> Dict[str, any]:
    """Run a basic DNS leak check."""
    dns_servers = get_dns_servers()
    
    print("Current DNS Servers:")
    print("-" * 40)
    
    detected_providers = []
    for server in dns_servers:
        provider = KNOWN_DNS_PROVIDERS.get(server, "Unknown/ISP")
        detected_providers.append(provider)
        print(f"  {server} ({provider})")
    
    print("-" * 40)
    
    # Check for ISP DNS (potential leak)
    isp_servers = [s for s, p in zip(dns_servers, detected_providers) 
                   if p == "Unknown/ISP"]
    
    if isp_servers:
        print(f"\n⚠️  POTENTIAL LEAK DETECTED")
        print(f"Found {len(isp_servers)} DNS server(s) that may be your ISP.")
        return {"leak": True, "servers": isp_servers}
    else:
        print(f"\n✅ No obvious DNS leak detected.")
        return {"leak": False, "servers": dns_servers}

if __name__ == "__main__":
    result = check_dns_leak()
```

### Method 4: Browser-Based DNS Leak Test

For a quick browser check without installing anything:

```javascript
// Quick browser-based DNS leak check
// Uses fetch to determine DNS resolution behavior

const dnsProviders = {
  '208.67.222.222': 'OpenDNS',
  '1.1.1.1': 'Cloudflare', 
  '8.8.8.8': 'Google',
  '9.9.9.9': 'Quad9'
};

// Make requests through different DNS servers to test
async function testDnsLeak() {
  const results = await Promise.all(
    Object.keys(dnsProviders).map(async (dns) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`https://${dns}/favicon.ico`, {
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeout);
        return { dns, provider: dnsProviders[dns], accessible: true };
      } catch {
        return { dns, provider: dnsProviders[dns], accessible: false };
      }
    })
  );
  
  console.table(results.filter(r => r.accessible));
}
```

## DNS Leak Test Results Explained

When you run a DNS leak test, you'll see results like this:

| Result | Meaning |
|--------|---------|
| **Your ISP detected** | Your DNS queries are leaking to your ISP |
| **VPN provider shown** | Your VPN's DNS is being used correctly |
| **Multiple countries shown** | Possible traffic routing through different servers |
| **No results returned** | DNS requests may be blocked entirely |

### What to Look For

A healthy DNS leak test should show:
- DNS servers belonging to your VPN provider
- All queries resolving through a single provider or a small set
- No servers from your physical location's ISP

### Warning Signs

- Your real ISP's DNS servers appearing
- Multiple unrelated DNS providers simultaneously
- DNS servers matching your physical location

## How to Prevent DNS Leaks

### 1. Enable DNS Leak Protection in Your VPN

Most reputable VPN apps include a "DNS leak protection" option. Enable it in your VPN settings.

### 2. Manually Set DNS Servers

Configure your network adapter to use privacy-focused DNS servers:

**On Windows (PowerShell as Admin):**
```powershell
Set-NetIPInterface -InterfaceAlias "VPN Adapter" -DnsServer "1.1.1.1,1.0.0.1"
```

**On macOS:**
```bash
networksetup -setdnsservers "VPN Service" 1.1.1.1 1.0.0.1
```

**On Linux (systemd-resolved):**
```bash
mkdir -p /etc/systemd/resolved.conf.d
cat > /etc/systemd/resolved.conf.d/vpn-dns.conf << EOF
[Resolve]
DNS=1.1.1.1 1.0.0.1
DNSOverTLS=yes
EOF
systemctl restart systemd-resolved
```

### 3. Use IPv6 Disable Option

If your VPN doesn't properly handle IPv6, you may need to disable IPv6 entirely on your network interface:

```bash
# Linux - disable IPv6
sysctl -w net.ipv6.conf.all.disable_ipv6=1
sysctl -w net.ipv6.conf.default.disable_ipv6=1
```

### 4. Use a VPN with Built-in DNS

Choose VPN providers that operate their own DNS servers and route all DNS through the encrypted tunnel. Providers like Mullvad, ProtonVPN, and NordVPN are known for strong DNS leak protection.

## Use Cases: Who Needs DNS Leak Testing?

### Security Researchers
When investigating malicious domains or tracking threat actors, maintaining a clean DNS profile prevents leaks that could alert adversaries.

### Journalists in Restrictive Regions
In countries with internet censorship, DNS leaks can expose browsing habits to state surveillance. Regular leak testing is essential.

### Businesses with Sensitive Operations
Corporate espionage is real. Employees accessing confidential data should verify their VPN's DNS handling.

### Privacy-Conscious Users
Even if you have nothing to hide, minimizing your digital footprint reduces attack surface and data broker profiling.

## DNS Leaks vs. WebRTC Leaks

While DNS leaks expose your query history, **WebRTC leaks** expose your real IP address through STUN/TURN requests—even when your VPN is active. Both should be tested regularly:

- [Browser Fingerprinting Protection](/blog/browser-fingerprinting-protection) — Learn how browsers can be used to track you beyond IP
- [VPN Detection Explained](/blog/vpn-detection-explained) — Understand how websites identify VPN users
- [IP Address Blacklist Check](/blog/ip-address-blacklist-check) — Check if your IP is flagged

## Conclusion

DNS leaks are a subtle but serious privacy threat that can undermine even the best VPN setups. The good news: they're easy to detect with the right tools and straightforward to fix once identified.

Run a DNS leak test before every sensitive browsing session, especially when connecting to a new network or using a new VPN provider. Your privacy depends on every layer of protection working together.

**Quick checklist:**
- [ ] Run a DNS leak test on each new network
- [ ] Enable DNS leak protection in your VPN settings
- [ ] Manually configure DNS servers to a privacy-focused provider
- [ ] Test after any network or VPN configuration change
- [ ] Consider IPv6 disable if your VPN doesn't handle it

Stay safe out there.
