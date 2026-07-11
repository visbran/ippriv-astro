---
title: 'DNS over HTTPS vs DNS over TLS: Choosing Encrypted DNS in 2026'
description: 'Compare DNS over HTTPS (DoH) and DNS over TLS (DoT) — how they work, performance differences, privacy implications, and which protocol best protects your DNS queries from interception.'
publishedAt: 2026-07-11
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop'
tags: ['dns', 'encrypted dns', 'doh', 'dot', 'privacy', 'network security']
draft: false
---

## Introduction: Why Your DNS Queries Are a Privacy Problem

Every time you type a website address into your browser, a DNS (Domain Name System) query leaves your device asking "what is the IP address for this domain?" This lookup traverses your network, passes through your ISP's servers, and may be logged, sold, or intercepted before reaching a DNS resolver. While your HTTPS traffic to that website may be encrypted, the DNS lookup itself is often sent in plain text — visible to your ISP, network administrator, and anyone monitoring your connection.

In 2026, encrypted DNS protocols have moved from experimental to mainstream. Firefox, Chrome, and iOS all support encrypted DNS. Cloudflare, Google, and Quad9 offer public resolvers. But the two dominant standards — **DNS over HTTPS (DoH)** and **DNS over TLS (DoT)** — are not interchangeable, and the choice between them has real consequences for privacy, performance, and compatibility.

This article breaks down how each protocol works, where they differ, and how to choose the right one for your setup.

## What Is DNS and Why Is It Usually Unencrypted?

DNS is the phonebook of the internet. When you visit `example.com`, your browser sends a DNS query to a resolver asking for that domain's IP address. The resolver responds, your browser connects, and the page loads.

Standard DNS (port 53, UDP or TCP) transmits these queries in plain text. Anyone along the path — your ISP, a WiFi operator, a national firewall, or a man-in-the-middle attacker — can read, log, or manipulate them. This is not a theoretical vulnerability. ISPs in many countries are legally required to log DNS queries. Hotspot operators use DNS interception to redirect users to login pages. And state-level actors have used DNS manipulation for censorship and traffic hijacking.

Encrypted DNS closes this gap by wrapping queries in TLS, preventing passive observation of what domains you are resolving.

## DNS over TLS (DoT): The Older Standard

DNS over TLS, defined in [RFC 7858](https://tools.ietf.org/html/rfc7858), establishes a persistent TLS connection to a DNS resolver on port 853. The protocol is straightforward: open a TCP connection, perform a TLS handshake, then send DNS queries over the encrypted channel.

**Key characteristics of DoT:**

- Uses port **853** exclusively
- Requires a persistent connection for efficiency
- Slightly lower overhead than DoH because it does not wrap DNS in HTTP
- Easier to block at the network level since port 853 is identifiable and blockable
- Native support in Android (since Pie), Linux resolvers like Stubby, and some routers

**DoT resolver examples:**

| Provider | Address |
|----------|---------|
| Cloudflare | `1.1.1.1` |
| Google | `8.8.8.8` |
| Quad9 | `9.9.9.9` |
| Quad9 (secure) | `dns.quad9.net` |

On Android, you can enable DoT by navigating to Settings → Network & Internet → Private DNS and entering a provider hostname. On Linux, [Stubby](https://github.com/getdnsapi/stubby) is the recommended resolver that speaks DoT to upstream servers.

## DNS over HTTPS (DoH): HTTP-Based Encryption

DNS over HTTPS, defined in [RFC 8484](https://tools.ietf.org/html/rfc8484), sends DNS queries inside an HTTPS request. The DNS payload is encoded in a small HTTP POST or GET body, and the entire HTTP transaction — including the Host header indicating which DoH server you are connecting to — is encrypted with TLS.

**Key characteristics of DoH:**

- Runs over port **443**, inside regular HTTPS traffic
- Indistinguishable from normal web browsing at the network level
- More resilient to blocking since all HTTPS is typically allowed
- Slightly higher overhead (HTTP framing, headers)
- Supported natively in Firefox, Chrome, Edge, iOS, and Windows 11

**DoH resolver examples:**

| Provider | URL |
|----------|-----|
| Cloudflare | `https://cloudflare-dns.com/dns-query` |
| Google | `https://dns.google/dns-query` |
| Quad9 | `https://dns.quad9.net/dns-query` |
| NextDNS | `https://dns.nextdns.io` |

Firefox ships with DoH enabled by default, routing DNS through Cloudflare (with an opt-out). Chrome on Windows 11 and later also enables DoH when the system resolver supports it. iOS 14 and later support DoH through Configuration Profiles or MDM.

## Side-by-Side Comparison

| Feature | DNS over TLS (DoT) | DNS over HTTPS (DoH) |
|---------|--------------------|----------------------|
| Port | 853 | 443 |
| Protocol | Raw TLS | HTTPS |
| Network visibility | Identifiable (port 853) | Looks like normal HTTPS |
| Blocking resistance | Low (port easily blocked) | High (HTTPS is essential) |
| Latency overhead | ~1-3ms | ~2-5ms |
| OS-level support | Android, some routers, Linux | Firefox, Chrome, iOS, Windows 11 |
| HTTP/2 or HTTP/3 | No | Yes (HTTP/3 with QUIC) |
| SNI visibility | N/A | DoH with ESNI/ECH hides SNI |

## Privacy Implications: Which Is Better?

Both DoT and DoH encrypt your DNS queries — a massive improvement over plain text. But they differ in what metadata remains visible.

### What DoT Leaks

Even with TLS encryption, DoT on port 853 reveals:
- The fact that you are making DNS queries (traffic shape is identifiable)
- The IP address of your DoT resolver
- The Server Name Indication (SNI) in the TLS handshake is **not** hidden (the resolver hostname is in the certificate)

### What DoH (with ESNI/ECH) Can Hide

DoH on port 443 benefits from HTTPS's broader camouflage:
- DNS queries look like normal web traffic
- When combined with **Encrypted Client Hello (ECH)**, even the hostname of the DoH server is hidden from network observers
- SNI is encrypted when ECH is supported (Firefox supports this; Chrome is rolling it out)

This makes DoH meaningfully more private on monitored networks where port 853 is blocked or flagged.

### Trust Models

Both protocols share a fundamental trust assumption: **you are trusting the DoH/DoT provider with your DNS data**. Cloudflare's 1.1.1.1 privacy policy commits to deleting logs within 24 hours. Google logs for 24-48 hours. Quad9 (nonprofit, Swiss-hosted) has the strongest privacy reputation. Choose your resolver provider based on who you trust with a complete list of every domain you resolve.

## Performance: Is There a Real Difference?

In practice, the latency difference between DoT and DoH is minimal for most users — typically within 5ms of each other and of unencrypted DNS on a fast connection. However, there are nuances:

- **DoT** has slightly lower overhead because it skips the HTTP framing layer
- **DoH** over HTTP/3 (using QUIC) can actually outperform DoT on high-latency connections due to QUIC's improved loss recovery
- **Connection reuse** matters more than protocol choice — both protocols benefit from persistent connections that amortize handshake costs across many queries
- **Geographic proximity** to the resolver matters more than protocol choice. A DoH resolver in the same city will outperform a DoT resolver on another continent

For most users, performance is not a deciding factor. The choice should be driven by blocking resistance and trust in the provider.

## Code Example: Testing a DoH Endpoint

You can test a DoH resolver directly from the command line with a simple HTTPS request:

```bash
# Query cloudflare-dns.com over DoH using curl
curl -s -H 'accept: application/dns-json' \
  'https://cloudflare-dns.com/dns-query?name=ippriv.com&type=A'

# Query Google's DoH resolver
curl -s -H 'accept: application/dns-json' \
  'https://dns.google/dns-query?name=ippriv.com&type=A'
```

Both return JSON-formatted DNS responses. You can also test DoH programmatically:

```javascript
// Browser-based DoH query using the Fetch API
async function dohQuery(domain, recordType = 'A') {
  const url = `https://cloudflare-dns.com/dns-query?name=${domain}&type=${recordType}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/dns-json' }
  });
  return response.json();
}

// Example usage
const result = await dohQuery('ippriv.com', 'A');
console.log(result.Answer?.[0]?.data); // IP address
```

## When to Use DoH vs DoT

**Use DoH when:**
- You are on a network that blocks or throttles port 853 (common in corporate and school environments)
- You want maximum camouflage for your DNS queries
- You are using a browser and the OS-level setting does not matter
- You want ECH support to hide even the DoH server hostname from your ISP

**Use DoT when:**
- You want OS-level DNS encryption that applies to all applications (not just browsers)
- You manage Android devices (native DoT support is excellent)
- You run a local resolver like Stubby on Linux and want a clean, dedicated channel
- You are configuring a router or firewall and want predictable port-based rules

## Security Considerations

### Certificate Validation

Both DoT and DoH require valid TLS certificates. DoT relies on the resolver's hostname resolving via standard DNS first — creating a bootstrapping problem if that initial DNS lookup is intercepted. DoH avoids this by using standard HTTPS certificates verifiable through any HTTPS-capable network.

### Split Horizon and Corporate Networks

If you use a corporate VPN that splits DNS traffic — resolving internal domains through an internal resolver and external domains through a public one — encrypted DNS can break this. DoH and DoT may bypass your VPN's DNS configuration and send all queries to the public resolver, making internal hostnames unresolvable. In corporate environments, consult your IT department before enabling encrypted DNS.

### Validation: DNSSEC Does Not Help Here

DNSSEC validates that DNS responses have not been tampered with in transit — it does not encrypt them. DNSSEC-signed responses are still sent in plain text. Encrypted DNS (DoH/DoT) and DNSSEC are complementary but independent protections.

## How to Enable Encrypted DNS

**Firefox (all platforms):**
1. Settings → Network Settings → Settings → Enable DNS over HTTPS
2. Choose Cloudflare, Google, or a custom provider

**Chrome / Edge (Windows 11+):**
1. Settings → Privacy and Security → Security → Use secure DNS
2. Select a provider or enter a custom DoH URL

**iOS 14+:**
1. Install a DoH configuration profile from a provider (Cloudflare, etc.)
2. Settings → General → VPN & Device Management → enable the profile

**Android 9+:**
1. Settings → Network & Internet → Private DNS
2. Select a provider hostname (e.g., `1.1.1.1`) or specify a custom DoT server

**Linux (Stubby):**
```yaml
# /etc/stubby/stubby.yml
upstream_recursive_servers:
  - address_data: 1.1.1.1
    tls_port: 853
    tls_name: cloudflare-dns.com
  - address_data: 9.9.9.9
    tls_port: 853
    tls_name: dns.quad9.net
```

## The Future: ODoH and Oblivious DNS

Emerging protocols push privacy even further. **Oblivious DNS over HTTPS (ODoH)**, specified in [RFC 9483](https://www.rfc-editor.org/rfc/rfc9483.html), adds a proxy relay between the client and the DoH resolver. The proxy sees the client's IP address but not the query. The resolver sees the query but not the client's IP address. Neither knows both.

**Oblivious DoH** separates identity from query at the protocol level — a fundamentally different trust model than simply choosing a privacy-respecting resolver.

Cloudflare and Google both support ODoH in experimental deployments. Widespread adoption is still maturing, but ODoH represents the direction encrypted DNS is heading.

## Conclusion

DNS over HTTPS and DNS over TLS both meaningfully improve on plain-text DNS by encrypting your queries and preventing passive surveillance. For most users, **DoH on port 443 is the better default** — it is harder to block, works in more environments, and benefits from ongoing work on ECH to hide even the server hostname.

DoT remains valuable for OS-level enforcement on Android and Linux, where you want all applications to use encrypted DNS without per-app configuration.

Regardless of which protocol you choose, switching away from your ISP's default resolver is one of the highest-impact, lowest-friction privacy improvements available in 2026. The minor configuration overhead takes minutes and eliminates a significant surveillance vector that has been wide open for decades.

---

**Related Articles**

- [How ISPs Track You Via IP Address](/blog/how-isps-track-you-via-ip) — DNS logging is one of the ways your ISP monitors activity. Learn how it fits into broader ISP surveillance.
- [DNS Leak Test: How to Check If Your VPN Is Leaking DNS](/blog/dns-leak-test) — If you use a VPN, a DNS leak undermines the privacy benefit. Learn how to detect and fix it.
- [What Does an IP Address Reveal About You](/blog/what-does-an-ip-address-reveal) — DNS queries are tied to your IP address. Understand the full picture of what your connection exposes.
