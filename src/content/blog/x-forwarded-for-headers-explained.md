---
title: 'X-Forwarded-For and Reverse Proxy Headers Explained'
description: 'Learn how X-Forwarded-For and related headers preserve client IP addresses through proxies, CDNs, and load balancers. Essential for developers.'
publishedAt: 2026-09-19
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&h=600&fit=crop'
tags: ['ip address', 'proxy', 'security', 'networking']
draft: false
---

## The Problem of the Hidden Client IP

Every HTTP request carries the **client IP address** in the TCP connection metadata. This is how a web server knows where to send its response. But in modern infrastructure, the server that terminates the TCP connection is rarely the application server that needs to know who the user is. A reverse proxy, a content delivery network (CDN), or a load balancer usually sits in between. When that happens, the application server sees the IP address of the proxy, not the original client.

**X-Forwarded-For** is the most common solution to this problem. It is a non-standard but universally supported HTTP request header that allows each proxy in a chain to append the client IP it sees, creating a record of the original source address. Understanding how this header works, what it can and cannot do, and how to handle it securely is essential for any developer building applications behind proxy infrastructure.

## What X-Forwarded-For Actually Does

When a client sends a request through a single reverse proxy, the proxy forwards the request to the backend application. The backend sees the proxy's IP address as the source of the TCP connection. To preserve the original client information, the proxy adds an **X-Forwarded-For** header to the outgoing request. The value is the client's IP address.

If the client is `203.0.113.45` and the proxy is `10.0.0.5`, the header looks like this:

```http
X-Forwarded-For: 203.0.113.45
```

When a second proxy sits behind the first, it appends the IP address it received from the first proxy. The chain grows from left to right, oldest to newest:

```http
X-Forwarded-For: 203.0.113.45, 198.51.100.10
```

Here, `203.0.113.45` is the original client, and `198.51.100.10` is the first proxy that the second proxy sees. The rightmost entry is always the IP address of the immediate upstream node from the perspective of the server reading the header.

## Related Headers You Will Encounter

X-Forwarded-For is part of a family of de facto standard headers that reverse proxies use to forward original request information. You should know the full set.

**X-Forwarded-For** carries the client IP chain, as described above.

**X-Forwarded-Host** carries the original **Host** header that the client sent. This matters when a proxy handles multiple domains and the backend application needs to know which site the user requested.

**X-Forwarded-Proto** indicates whether the original connection used HTTP or HTTPS. A load balancer terminating TLS will set this to `https` so the backend application knows the connection was secure, even though the internal hop between proxy and backend may be unencrypted HTTP.

**X-Forwarded-Port** carries the original destination TCP port, typically `80` or `443`.

**X-Real-IP** is a simpler alternative used by some proxies, notably **NGINX**. It contains only the client's IP address, not a chain. If you trust only one proxy layer, X-Real-IP is easier to parse. If multiple proxies are involved, it is less useful than X-Forwarded-For because it does not preserve the full path.

**CF-Connecting-IP** is a vendor-specific header set by **Cloudflare**. Because Cloudflare scrubs and replaces X-Forwarded-For with its own data, it provides this separate header so origin servers can reliably identify the original client IP without worrying about spoofed headers from earlier in the chain.

## The Standardized Alternative: Forwarded

The IETF defined **Forwarded** in RFC 7239 as a standardized replacement for the X-Forwarded-* headers. It uses a structured syntax:

```http
Forwarded: for=203.0.113.45;proto=https;host="ippriv.com"
```

Despite its cleaner design, Forwarded has not displaced X-Forwarded-For in practice. Most applications, frameworks, and proxies still use and expect the older headers. Developers should be aware of both, but X-Forwarded-For remains the header you are most likely to encounter in production.

## Why X-Forwarded-For Creates a Security Risk

The header is trivial to spoof. Any client can send an HTTP request with an arbitrary X-Forwarded-For value:

```http
X-Forwarded-For: 1.2.3.4
```

If a naïve application server simply trusts the first IP in the header, an attacker can inject a false client IP address. This leads to several practical problems:

- **IP-based rate limiting bypass.** If rate limits are enforced based on X-Forwarded-For without validation, an attacker can rotate the spoofed IP on every request and evade throttling.
- **False geolocation data.** An application that logs or acts on geolocation based on X-Forwarded-For will record the spoofed location.
- **Access control evasion.** Systems that whitelist or blacklist by IP may be tricked by a forged header.

For more on how proxies and VPNs manipulate traffic, read our guide on [how websites detect and block VPNs](/blog/how-websites-detect-and-block-vpns).

## How to Handle X-Forwarded-For Securely

The only safe way to use X-Forwarded-For is to treat it as untrusted input until validated against a whitelist of known proxy IP addresses.

### Define Your Trusted Proxies

Your application must know which IP addresses are legitimate proxies. This list is typically your load balancer subnet, your CDN IP ranges, or your internal proxy addresses. Any IP address not in this list must be treated as a potential client, not as a proxy.

### Parse from the Right, Not the Left

The standard advice is to parse the X-Forwarded-For chain from the rightmost entry and work leftward, stopping at the first IP that is not a trusted proxy. That IP is the actual client. All entries to the left of it may be spoofed by the client or by untrusted intermediate nodes.

For example, if your trusted proxies are `10.0.0.0/8` and you receive:

```http
X-Forwarded-For: 1.2.3.4, 10.0.0.5, 10.0.0.10
```

You read from the right. `10.0.0.10` is a trusted proxy. `10.0.0.5` is also a trusted proxy. `1.2.3.4` is not in your trusted list. That is the client IP. The entry to the left of it is likely spoofed and should be discarded.

### Use Framework Middleware

Most modern web frameworks provide middleware for this exact purpose:

- **Express.js:** `trust proxy` setting.
- **Django:** `USE_X_FORWARDED_HOST` and proxy IP whitelisting.
- **Nginx:** `set_real_ip_from` and `real_ip_header` directives.
- **Apache:** `mod_remoteip` with `RemoteIPTrustedProxy`.

If you configure this middleware correctly, the framework handles the parsing and validation for you, and `request.ip` or equivalent will contain the verified client address.

### Do Not Trust It for Security Decisions Alone

Even a correctly parsed X-Forwarded-For value should not be the sole basis for critical security decisions. IP addresses can be rotated, shared via CGNAT, or hidden behind legitimate privacy tools. Use IP-based signals as one input in a broader risk model, not as a definitive identity.

## How CDNs and Load Balancers Affect the Header

Different infrastructure layers handle X-Forwarded-For differently.

**Amazon CloudFront** appends the viewer's IP to the header before forwarding to the origin. If the viewer already sent a spoofed X-Forwarded-For, CloudFront appends the real viewer IP to the right, but the spoofed values remain on the left. This is why right-to-left parsing is critical.

**Cloudflare** replaces X-Forwarded-For entirely and provides the client IP in **CF-Connecting-IP**. If you use Cloudflare, you should read CF-Connecting-IP after validating that the request came from a Cloudflare IP address.

**AWS Elastic Load Balancing** preserves the client's IP in the TCP connection metadata for Network Load Balancers but relies on X-Forwarded-For for Application Load Balancers. The ALB appends the client IP it sees.

**NGINX**, when configured as a reverse proxy, sets X-Forwarded-For by default if the `proxy_set_header` directive is configured. Many default NGINX configurations forget to set the other X-Forwarded-* headers, which can cause HTTPS detection issues in applications.

## Detecting Proxy and VPN Usage from Headers

Beyond X-Forwarded-For, other headers can reveal proxy or VPN usage. **Via** and **Proxy-Connection** are sometimes present. Unusual or mismatched combinations of X-Forwarded-Proto and the actual connection scheme can indicate a misconfigured proxy or a deliberate attempt to hide the traffic path.

For a deeper look at how platforms identify proxies and VPNs, see our article on [proxy detection techniques](/blog/proxy-detection-techniques). If you need to verify the origin of an IP address, including whether it belongs to a known hosting or VPN provider, use [IPPriv's security API](/api-docs) to check `isProxy`, `isVPN`, and `isHosting` flags in a single call.

## Practical Configuration Examples

Here is how you might configure NGINX to set and respect these headers properly:

```nginx
location / {
    proxy_pass http://backend;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

And here is how an Express.js application might trust a specific proxy subnet:

```javascript
const app = express();
app.set('trust proxy', ['loopback', '10.0.0.0/8']);
```

With this setting, Express parses X-Forwarded-For from the right and extracts the correct client IP automatically.

## What to Do Now

If your application runs behind any kind of proxy, load balancer, or CDN, you should audit how it determines the client IP address today. Check your framework's proxy trust settings. Ensure you have a whitelist of trusted proxy IPs. Parse X-Forwarded-For from the right, and discard anything to the left of the first untrusted IP. If you use Cloudflare, read CF-Connecting-IP instead.

Incorrect handling of forwarded headers is one of the most common ways applications leak incorrect client data, bypass rate limits, or make flawed security decisions. Fixing it is usually a matter of adding a few lines of middleware or configuration, and it immediately improves the accuracy of any IP-based logic in your system. If you want to verify what your application sees, run an [IP lookup](/ip-lookup) from behind your proxy and check whether the detected address matches the original client.
