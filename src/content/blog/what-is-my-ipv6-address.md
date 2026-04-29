---
title: 'What Is My IPv6 Address? A Complete Guide for Developers'
description: 'Learn how to find your IPv6 address, understand how IPv6 addressing works, and build applications that handle IPv6 correctly. Includes code examples, comparison with IPv4, and practical use cases.'
publishedAt: 2026-04-29
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop'
tags: ['IPv6', 'networking', 'developer guide', 'IP address']
draft: false
---

## Introduction: Why IPv6 Matters Now More Than Ever

The internet is running out of IPv4 addresses. With over 4 billion possible IPv4 addresses, the world collectively assumed that would be enough. It wasn't. The explosion of smartphones, IoT devices, cloud services, and global connectivity has consumed the IPv4 address space to the point of exhaustion. Regional internet registries have been allocating from the final blocks for years, and network engineers have been compensating with NAT, carrier-grade NAT, and IPv6 transition technologies.

IPv6 solves this with a vastly larger address space — 340 undecillion addresses, to be precise. But IPv6 is more than just "more addresses." It introduces a simplified header format, built-in security (IPsec), automatic address configuration (SLAAC), and hierarchical routing structures that improve global scalability.

This guide covers everything you need to know about identifying your IPv6 address, understanding how IPv6 addressing works, and building applications that handle both IPv4 and IPv6 correctly.

## What Is an IPv6 Address?

An IPv6 address is a 128-bit identifier assigned to any device participating in an IPv6 network. Unlike IPv4, which uses 32-bit addresses written as four decimal octets (e.g., `192.168.1.1`), IPv6 addresses are written as eight groups of four hexadecimal digits, separated by colons.

A typical IPv6 address looks like this:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

This can be compressed: leading zeros in each group can be omitted, and consecutive groups of zeros can be replaced with `::`. The same address compressed:

```
2001:db8:85a3::8a2e:370:7334
```

### IPv6 Address Types

IPv6 defines several address types, each serving a specific role in network communication:

| Type | Prefix | Purpose |
|------|--------|---------|
| Global Unicast | `2000::/3` | Public addresses, routable on the internet |
| Link-Local | `fe80::/10` | Communication within a single network link |
| Unique Local | `fc00::/7` | Private addressing within a site or organization |
| Loopback | `::1` | The IPv6 equivalent of 127.0.0.1 |
| Unspecified | `::` | Address of a device that has not yet been assigned an address |
| Multicast | `ff00::/8` | One-to-many communication |

Understanding these types is critical when building network applications. A server listening on a link-local address is only reachable by devices on the same network segment. A server listening on a global unicast address is reachable from anywhere on the public internet.

## How to Find Your IPv6 Address

There are several ways to discover your IPv6 address, from simple web-based tools to command-line utilities.

### Using an Online Tool

The easiest method is to visit a site that displays your detected IPv6 address. ippriv.com's [IP lookup tool](/ip-lookup) shows both your IPv4 and IPv6 addresses, along with geolocation, ISP, and network type information.

When you visit from an IPv6-enabled network, you'll see something like:

```
IPv6: 2001:db8:85a3:0:1234:5678:9abc:def0
ISP: Example ISP
Location: San Francisco, CA, US
Network Type: Residential
```

### Using the Command Line

On Linux and macOS, use the `ip` command:

```bash
ip -6 addr show
```

Or for a more concise view:

```bash
ip -6 addr | grep inet6
```

Example output:

```
inet6 2001:db8:85a3::1/128 scope global dynamic
inet6 fe80::1/64 scope link
inet6 ::1/128 scope host
```

- The `scope global` address is your public IPv6 address ( routable on the internet).
- The `scope link` address is your link-local address (only valid on the local network segment).
- The `::1` address is your loopback address.

On Windows, use `netsh`:

```cmd
netsh interface ipv6 show address
```

Or use PowerShell:

```powershell
Get-NetIPAddress -AddressFamily IPv6
```

### Detecting IPv6 with JavaScript

You can detect a user's IPv6 address from within the browser using WebRTC, though this comes with privacy caveats:

```javascript
function getIPv6Address() {
    return new Promise((resolve) => {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(err => resolve(null));
        
        pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            
            const candidate = event.candidate.candidate;
            // Extract IPv6 address from candidate string
            const ipv6Match = candidate.match(/([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/i);
            if (ipv6Match) {
                resolve(ipv6Match[1]);
                pc.close();
            }
        };
        
        // Timeout after 3 seconds
        setTimeout(() => {
            pc.close();
            resolve(null);
        }, 3000);
    });
}

getIPv6Address().then(ipv6 => {
    console.log('Detected IPv6:', ipv6);
});
```

Note: This technique is also used for WebRTC leak detection. WebRTC can expose your local network IPv6 address even when you're behind a NAT. For privacy-conscious applications, you may want to [detect WebRTC leaks](/blog/webrtc-leak-test) and offer users a way to disable it.

### Using cURL

You can query your public IPv6 address via an API:

```bash
curl -6 https://api.ipify.org?format=json
```

Or use the ippriv.com API:

```bash
curl "https://ippriv.com/api/lookup?ip=me"
```

### Using Python

```python
import urllib.request
import json

def get_ipv6():
    try:
        # Using ipify's IPv6 endpoint
        response = urllib.request.urlopen('https://api64.ipify.org?format=json', timeout=5)
        data = json.loads(response.read().decode())
        return data.get('ip')
    except Exception as e:
        return f"Error: {e}"

ipv6 = get_ipv6()
print(f"Your IPv6 address: {ipv6}")
```

## IPv6 Addressing: The Structure Explained

A global unicast IPv6 address is structured in a way that mirrors the hierarchical routing of the internet itself.

### Global Unicast Address Format

```
|  3 bits  |     13 bits    |   8 bits   |        24 bits        |        48 bits         |
|  001     |   TLA ID       |   NLA ID   |      SLA ID           |    Interface ID        |
| Prefix   |  Top-Level     | Next-Level | Subnet Level          |  Device/Host           |
| 2000::/3 |  Aggregation   | Aggreg.    |  Assignment           |  Identifier            |
```

- **Global Routing Prefix** (`2000::/3`): The first three bits indicate this is a global unicast address. The next 45 bits identify your ISP's global routing prefix.
- **Subnet ID** (16 bits): Identifies a specific subnet within your network. This gives you 65,536 subnets.
- **Interface ID** (64 bits): Identifies the specific device within the subnet. This is typically derived from the device's MAC address using EUI-64 format, or generated randomly for privacy.

### SLAAC: Stateless Address Autoconfiguration

One of IPv6's most elegant features is SLAAC — the ability for devices to self-assign IPv6 addresses without a DHCP server.

The process:

1. The host generates a link-local address (`fe80::/10` + modified EUI-64).
2. The host performs Duplicate Address Detection (DAD) to ensure no other device has the same address.
3. The host listens for Router Advertisement (RA) messages from the local router.
4. The RA contains the network prefix (e.g., `2001:db8:85a3::/64`).
5. The host combines this prefix with its interface identifier to form a global address.

This means a device can get a routable IPv6 address the moment it connects to a network — no DHCP server required.

## IPv6 vs IPv4: Key Differences for Developers

If you're building network applications, understanding these differences is essential:

| Aspect | IPv4 | IPv6 |
|--------|------|------|
| Address length | 32 bits | 128 bits |
| Address format | `192.168.1.1` | `2001:db8::1` |
| Total addresses | ~4.3 billion | ~340 undecillion |
| Header size | 20-60 bytes (variable) | 40 bytes (fixed) |
| Security | IPsec (optional) | IPsec (built-in) |
| Address config | DHCP or manual | SLAAC + DHCPv6 |
| Broadcast | Yes | No (uses multicast) |
| Fragmentation | In network and hosts | In hosts only |
| Checksum | Header checksum | No checksum |
| DNS records | A | AAAA |

### Building Dual-Stack Applications

Modern applications should support both IPv4 and IPv6 — a configuration called "dual-stack." Most operating systems and networks today operate in dual-stack mode, meaning a device may have both an IPv4 and IPv6 address simultaneously.

In Node.js, a dual-stack server looks like this:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const clientIP = req.socket.remoteAddress;
    res.end(`Hello from ${clientIP}\n`);
});

// Listen on both IPv4 and IPv6
server.listen(80, '::', () => {
    console.log('Server running on both IPv4 and IPv6');
});
```

Binding to `::` (the IPv6 wildcard address) makes the server accessible via both protocols simultaneously.

In Python with Flask:

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    client_ip = request.remote_addr
    return f'Client IP: {client_ip}\n'

if __name__ == '__main__':
    # Run on both IPv4 and IPv6
    app.run(host='::', port=5000)
```

### Handling A and AAAA DNS Records

IPv6 applications rely on AAAA DNS records (the four A's stand for "quadruple A"):

```bash
# Query AAAA record for a domain
dig AAAA google.com

# Using drill
drill AAAA google.com

# Using nslookup
nslookup -query=AAAA google.com
```

When a DNS resolver returns both A and AAAA records for a domain, the operating system's resolver chooses which to use ( this is called "happy eyeballs" and prioritizes whichever is faster).

## Why You Should Care About IPv6

Even if your application doesn't directly manipulate IPv6 addresses, the transition affects you:

1. **SEO**: Google [officially uses IPv6 as a signal](https://developers.google.com/search/docs/crawling/indexing) in search ranking. Sites that serve content over IPv6 may see a ranking boost.

2. **Geolocation**: IPv6 addresses provide more granular location data. IPv6's hierarchical addressing allows geolocation databases to pinpoint location at the subnet level with higher accuracy for some providers. See our guide on [understanding IP geolocation](/blog/understanding-ip-geolocation) for more.

3. **Network Security**: IPv6's built-in IPsec support enables authenticated and encrypted communication at the network layer. Understanding IPv6 is essential for modern [network security practices](/blog/what-does-an-ip-address-reveal).

4. **IoT and Device Addressing**: With billions of IoT devices coming online, IPv4's address exhaustion is a real constraint. Many modern IoT devices are IPv6-only. Building IPv6 awareness into your applications future-proofs them.

5. **VPN and Privacy**: VPNs work with IPv6, but [VPN detection](/blog/vpn-detection-explained) must account for both protocols. An IPv6 leak can expose your real identity even when your IPv4 address is hidden.

## Common IPv6 Misconceptions

**"IPv6 addresses are hard to read."**
While the hexadecimal notation looks intimidating at first, tools and libraries handle IPv6 formatting automatically. Humans rarely need to read or type raw IPv6 addresses.

**"IPv6 is less private because addresses are tied to hardware."**
IPv6 has built-in privacy extensions (RFC 4941) that generate random, temporary interface identifiers that change periodically. These privacy addresses are used for outgoing connections, while a stable address can still be assigned for servers.

**"IPv6 is optional."**
Most modern operating systems ship with IPv6 enabled by default. Many networks and CDNs are IPv6-first. Even if your application doesn't actively use IPv6, it must not break when operated in an IPv6 environment.

**"NAT isn't needed with IPv6."**
While IPv6's vast address space eliminates the need for address sharing via NAT, NAT still exists in IPv6 for port forwarding, firewall traversal, and network segmentation scenarios. The difference is that IPv6 NAT is typically between public and public addresses, not public to private.

## Testing Your IPv6 Connectivity

Run these commands to verify your network's IPv6 configuration:

```bash
# Test IPv6 connectivity
ping6 -c 3 ipv6.google.com

# Test IPv6 DNS resolution
dig AAAA cloudflare.com

# Check your routing
traceroute6 google.com

# Test with curl over IPv6
curl -6 -v https://example.com
```

If you're a developer testing your own services:

```bash
# Check if your server is listening on IPv6
ss -tulnp | grep -E ':80|:443'

# The output should show '::' or '0.0.0.0' for dual-stack
```

## Conclusion

Finding and understanding your IPv6 address is the first step in building IPv6-aware applications. The internet is transitioning to IPv6, and while the deadline has been "imminent" for over two decades, real IPv6 adoption is now significant and growing. Major content providers, cloud platforms, and mobile networks carry substantial IPv6 traffic.

The good news for developers: most of your existing code works with IPv6 without modification, as long as you're using hostname-based connections rather than hardcoded IPv4 addresses. The abstractions provided by operating systems, DNS, and programming languages handle the protocol differences in most cases. The cases where they don't — WebRTC leaks, address-family-specific socket bindings, DNS resolution edge cases — are exactly the situations where solid IPv6 knowledge makes the difference between a secure application and a privacy gap.

To see what your IPv6 address looks like in the wild, [use the ippriv.com IP lookup tool](/ip-lookup). For a deeper dive into how IP addresses work across versions, read our guide on [IPv4 vs IPv6: A Developer Guide](/blog/ipv4-vs-ipv6). If you're building applications that need to classify or detect network types from IP addresses, explore the [IPPriv API documentation](/api-docs) for IPv6-enabled endpoints.
