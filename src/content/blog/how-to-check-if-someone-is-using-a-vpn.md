---
title: 'How to Check If Someone Is Using a VPN'
description: 'Learn the exact methods to detect VPN usage — from IP-based checks to behavioral analysis. Includes code examples and real-world use cases.'
publishedAt: 2026-04-28
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop'
tags: ['vpn detection', 'privacy', 'ip address', 'proxy detection']
draft: false
---

## Introduction: What Is VPN Detection?

VPN detection is the process of identifying when a user is routing their internet connection through a Virtual Private Network (VPN) server rather than connecting directly from their ISP-assigned IP address. If you've ever wondered how websites or services determine whether you're using a VPN, this guide walks through the practical methods — from simple IP database lookups to more advanced behavioral and timing analysis.

Understanding these techniques is useful whether you're a developer building fraud detection systems, a security engineer evaluating risk signals, or simply curious about how VPN detection works. We cover both the technical mechanisms and their real-world limitations, so you can apply the right approach to your specific use case.

If you want a broader overview before diving in, see our article on [VPN detection explained](/blog/vpn-detection-explained) for the foundational concepts.

---

## Why Detect VPN Usage?

VPNs serve legitimate purposes — protecting privacy on public networks, enabling remote work, and bypassing censorship. But from a platform's perspective, VPN usage can obscure a user's true geographic location and make risk assessment more difficult.

Common reasons to detect VPN usage include:

- **Fraud prevention**: Attackers frequently use VPNs to hide their true location and link fraudulent accounts together.
- **License compliance**: Streaming and gaming platforms enforce geographic restrictions that VPNs can bypass.
- **Security monitoring**: Sudden IP changes from residential to datacenter IPs can signal account compromise.
- **Ad fraud detection**: Advertisers use VPN detection to identify inflated engagement metrics.

No single detection method is foolproof. The most reliable approach combines multiple signals, each of which provides partial evidence. Let's walk through the methods.

---

## IP-Based Detection: Checking Against Known VPN Ranges

The most straightforward detection method is checking an IP address against databases of known VPN and proxy server ranges. Commercial VPN providers operate servers in large datacenter facilities, and those IP blocks are tracked by threat intelligence providers.

### How It Works

You maintain (or subscribe to) a database that maps IP ranges to known VPN providers. When a user connects, you look up their IP in the database. A match indicates VPN usage.

```python
import ipaddress

# Simplified VPN IP range check
VPN_IP_RANGES = [
    ("104.20.0.0/16", "CloudVPN"),
    ("185.65.134.0/24", "NordVPN"),
    ("45.33.32.0/24", "Linode VPN"),
]

def is_vpn_ip(ip_string: str) -> tuple[bool, str | None]:
    ip = ipaddress.ip_address(ip_string)
    for cidr, provider in VPN_IP_RANGES:
        if ip in ipaddress.ip_network(cidr):
            return True, provider
    return False, None

# Example usage
ip = "185.65.134.50"
is_vpn, provider = is_vpn_ip(ip)
print(f"VPN detected: {is_vpn}")  # True
print(f"Provider: {provider}")     # NordVPN
```

### Limitations

- Requires maintaining or purchasing an up-to-date database.
- Smaller or custom VPN setups may not be in any database.
- IP ranges get added and removed constantly — database staleness is a real issue.
- Residential VPNs (using real consumer IP ranges) are not detected by this method.

### Real-World Use

ippriv's API maintains a continuously updated dataset of known VPN, proxy, and datacenter IP ranges. A single API call returns a confidence score indicating whether an IP is likely a VPN exit node:

```javascript
// ippriv API usage example
const response = await fetch('https://ippriv.com/api/v1/detect?ip=' + userIp);
const { is_vpn, confidence, provider } = await response.json();
```

---

## Port Detection: Identifying Common VPN Ports

VPN protocols communicate on specific ports. Detecting incoming connections on these ports can indicate VPN usage, though this method has significant constraints.

### Common VPN Ports

| Protocol | Port |
|----------|------|
| OpenVPN | 1194 (UDP), 443 (TCP) |
| WireGuard | 51820 (UDP) |
| IPSec/IKEv2 | 500 (UDP), 4500 (UDP) |
| L2TP/IPSec | 1701 (UDP) |
| PPTP | 1723 (TCP) |

### How It Works

From a server-side perspective, you cannot directly observe which port a client used to connect to an external VPN server. Port detection in this context typically refers to analyzing network flow data — looking at outbound connections from a network and identifying patterns consistent with VPN traffic.

A more practical server-side approach is checking whether a server's *listening* ports suggest it's running VPN software, but this only applies when you're analyzing the endpoint itself, not a client connecting to it.

### Limitations

- You cannot detect which VPN port a user's device is using for their external VPN connection from server-side observation alone.
- Many VPNs run on port 443 (HTTPS), making traffic indistinguishable from normal web browsing.
- This method is most useful in controlled network environments, not for web requests.

### Appropriate Use Cases

Port detection is useful when you control the network infrastructure and can inspect outbound connection patterns. For standard web applications processing incoming HTTP requests, this method is not applicable.

---

## DNS Leak Test

When you use a VPN, your device should route all DNS requests through the VPN tunnel. A DNS leak occurs when these requests bypass the VPN and go through your ISP instead, potentially exposing your real location.

### How It Works

A DNS leak test works by querying DNS servers you control, or by using a known test domain that resolves to a unique IP address. If the DNS query for that test domain originates from your ISP's resolver rather than your VPN's DNS server, a leak is confirmed.

```javascript
// Simplified DNS leak test (browser-side)
async function checkDnsLeak() {
  const testDomain = 'dnsleaktest.ippriv.com';
  const testIp = '203.0.113.50'; // Our контрольный IP

  try {
    // Make a request that forces a DNS lookup
    const start = performance.now();
    await fetch(`https://${testDomain}/probe?${Date.now()}`, {
      mode: 'no-cors',
      cache: 'no-store'
    });
    const elapsed = performance.now() - start;

    // If the request resolves quickly and reaches our server,
    // the DNS went through expected channels
    return { leaked: false, latency: elapsed };
  } catch (e) {
    // If our server doesn't receive the request, DNS may have leaked
    return { leaked: true, error: e.message };
  }
}
```

### Limitations

- DNS leaks are a client-side configuration issue, not a server-side detection method.
- You can offer a DNS leak test tool to your users, but you cannot detect leaks from server-side HTTP requests alone.
- Modern VPNs have built-in DNS leak protection.

### When to Use

If you're building privacy-focused tooling, offering a [DNS leak test](/blog/dns-leak-test) to your users is valuable for their own awareness. From a server-side fraud detection perspective, DNS leak signals are not directly observable.

---

## WebRTC Leak Detection

WebRTC (Web Real-Time Communication) allows browsers to establish direct peer-to-peer connections for features like video chat. However, WebRTC can expose a user's real IP address even when they're behind a VPN, because it prioritizes local network interfaces.

### How It Works

A WebRTC leak test works by instructing the browser to gather all possible ICE candidates — these include local IPs, server reflexive IPs (via STUN), and relayed IPs (via TURN). If the browser returns a public IP that differs from the VPN-assigned IP, a leak is detected.

```javascript
// WebRTC leak detection
function detectWebRtcLeak() {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]});

    let leakedIps = [];

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        // Gathering complete
        pc.close();
        resolve({ leaked: leakedIps.length > 0, ips: leakedIps });
        return;
      }

      const candidate = event.candidate;
      // Extract IP from candidate string
      const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (ipMatch) {
        const ip = ipMatch[1];
        // Check if this IP differs from expected VPN IP
        if (ip !== EXPECTED_VPN_IP && !ip.startsWith('10.')) {
          leakedIps.push(ip);
        }
      }
    };

    pc.createDataChannel('test');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
  });
}
```

### Limitations

- WebRTC leaks only affect browser-based users — mobile apps and other non-browser clients are unaffected.
- This is a client-side check, not something you can detect from server-side requests.
- Many VPN clients now block WebRTC by default.

### When to Use

Offer a [WebRTC leak test](/blog/webrtc-leak-test) page on your site to help users self-assess their privacy configuration. For automated detection during user sessions, you would need client-side JavaScript to report the findings back to your server.

---

## TTL and Hop Count Analysis

Every IP packet has a Time-To-Live (TTL) field that decrements at each network hop. VPN traffic typically traverses additional hops compared to direct connections, and the TTL value at the destination can reveal this.

### How It Works

When a packet arrives at your server, you can examine its TTL value. A packet with a low initial TTL (e.g., 64) that has traversed several hops will arrive with a reduced TTL. VPN traffic often arrives with lower-than-expected TTL values, indicating additional routing infrastructure.

Additionally, traceroute analysis can reveal the number of hops between the client and your server. VPN connections typically show more hops than a direct residential ISP connection.

```python
import socket
import struct

def estimate_hop_count(ttl: int, initial_ttl: int = 64) -> int:
    """Estimate hops based on TTL value"""
    return initial_ttl - ttl

def analyze_connection_quality(ttl: int, rtt_ms: float) -> dict:
    """Infer connection characteristics from TTL and latency"""
    hops = estimate_hop_count(ttl)

    # High hop count + high latency suggests VPN or proxy
    if hops > 15 and rtt_ms > 100:
        return {
            'suspicious': True,
            'reason': 'High hop count and latency',
            'hops_estimated': hops
        }

    return {
        'suspicious': False,
        'hops_estimated': hops
    }

# Example: packet arrives with TTL of 52
result = analyze_connection_quality(ttl=52, rtt_ms=85)
print(result)
# {'suspicious': True, 'reason': 'High hop count and latency', 'hops_estimated': 12}
```

### Limitations

- TTL values can be spoofed by VPN clients.
- Different operating systems use different initial TTL values (Windows: 128, Linux: 64, macOS: 64).
- Network conditions vary widely, making this an imprecise signal.
- Best used as one input among many, not as definitive evidence.

### Appropriate Use

TTL analysis is useful in network forensics and security monitoring systems where you have access to raw packet data. For standard web applications, this level of network inspection is typically not accessible.

---

## Behavioral and Timing Analysis

VPN users sometimes exhibit subtle behavioral differences from direct connections — slightly longer response times due to encryption overhead, different request patterns, or consistency anomalies between IP-based geolocation and other signals.

### How It Works

Behavioral analysis collects multiple data points over time and looks for patterns:

- **Request timing**: VPN encryption and tunneling add latency. Statistical analysis of request timing distributions can flag unusually high encryption overhead.
- **Geographic consistency**: Does the user's IP geolocation match their session behavior (time zone, language, browsing patterns)?
- **TCP fingerprinting**: VPN software uses specific TCP stack configurations. Unusual TCP option combinations can indicate VPN traffic.
- **TLS fingerprinting**: JA3 and other TLS fingerprinting techniques can identify VPN client signatures.

```python
from collections import Counter
import statistics

def analyze_timing_pattern(request_times: list[float], expected_ping_ms: float) -> dict:
    """Analyze request timing for VPN indicators"""
    if len(request_times) < 5:
        return {'confidence': 'low', 'suspicious': None}

    avg_time = statistics.mean(request_times)
    std_dev = statistics.stdev(request_times)

    # VPN overhead typically adds 20-100ms
    overhead = avg_time - expected_ping_ms

    if overhead > 50 and std_dev > 20:
        return {
            'confidence': 'medium',
            'suspicious': True,
            'reason': f'High latency ({overhead:.1f}ms overhead) and variability ({std_dev:.1f}ms std dev)'
        }

    return {
        'confidence': 'low',
        'suspicious': False
    }

# Example: user requests average 180ms, expected baseline 120ms
result = analyze_timing_pattern([175, 182, 190, 170, 195], expected_ping_ms=120)
print(result)
# {'confidence': 'medium', 'suspicious': True, 'reason': 'High latency (60.0ms overhead)...'}
```

### Limitations

- Behavioral signals are probabilistic, not deterministic.
- VPN technology varies — WireGuard has minimal overhead compared to older protocols.
- False positives are common; this method requires careful tuning.
- Privacy implications: extensive behavioral profiling raises ethical concerns.

### When to Use

Behavioral analysis is most appropriate in high-stakes environments (financial platforms, anti-fraud systems) where the cost of false positives is acceptable in exchange for catching sophisticated actors. It should never be the sole detection method.

---

## Commercial VPN Detection APIs

Building and maintaining all these detection methods is complex. Commercial APIs like ippriv provide unified endpoints that combine IP database lookups, ASN analysis, datacenter detection, and behavioral signals into a single confidence score.

### How It Works

You send an IP address to the API and receive structured detection results:

```javascript
// ippriv VPN detection API
const response = await fetch('https://ippriv.com/api/v1/detect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ip: '203.0.113.50', modes: ['vpn', 'proxy', 'datacenter'] })
});

const result = await response.json();
// {
//   "ip": "203.0.113.50",
//   "vpn": { "detected": true, "confidence": 0.95, "provider": "ExpressVPN" },
//   "proxy": { "detected": false, "confidence": 0.1 },
//   "datacenter": { "detected": true, "confidence": 0.88 },
//   "asn": { "asn": "AS12345", "org": "Akamai" }
// }
```

### Advantages

- No database maintenance required.
- Continuous updates as VPN providers add new IP ranges.
- Combined scoring from multiple detection methods.
- Easy integration via REST API.

### Limitations

- External API dependency (latency, cost, availability).
- Third-party data means you don't control the detection logic.
- May not detect custom or private VPN implementations.

---

## Detection Methods Comparison

| Method | Accuracy | Limitations | Speed | Best Use Case |
|--------|----------|-------------|-------|---------------|
| IP Database Lookup | High for known VPNs | Misses custom VPNs | Fast | First-line check |
| ASN Lookup | Medium-High | Fails for generic datacenter VPNs | Fast | Identifying branded VPNs |
| Datacenter Detection | High | False positives for remote workers | Fast | General VPN screening |
| Port Analysis | Low | Cannot detect client-side ports | N/A | Network forensics only |
| DNS Leak Test | N/A (client-side) | Requires user participation | Medium | Privacy tool, not detection |
| WebRTC Leak Test | N/A (client-side) | Browser-only | Medium | Privacy tool, not detection |
| TTL/Hop Count | Low-Medium | Spoofable, noisy | Medium | Network forensics |
| Behavioral Analysis | Medium | False positives, privacy concerns | Slow | High-stakes risk assessment |
| Commercial API | High | External dependency | Fast | Production fraud systems |

---

## Conclusion: Practical Recommendations

VPN detection is not about invading privacy — it's about understanding when the IP address you're seeing may not represent a user's true origin. Here are practical recommendations for implementing VPN detection:

1. **Start with IP database lookups**: This covers the majority of commercial VPN users with minimal infrastructure. Use a reputable provider that updates their data frequently.

2. **Layer in ASN and datacenter detection**: These signals catch VPNs that use generic datacenter infrastructure without recognizable provider names. They also flag other risk indicators like hosting providers associated with abuse.

3. **Use behavioral signals as a supplement**: In high-stakes environments, add timing and consistency checks to your detection pipeline, but calibrate thresholds carefully to avoid harming legitimate users.

4. **Offer privacy tools to your users**: DNS leak tests and WebRTC leak tests help privacy-conscious users understand their exposure. These don't serve fraud detection directly but build trust.

5. **Combine signals into a confidence score**: No single method is definitive. Combine multiple signals, weight them by reliability, and use the resulting confidence score in your risk decisions rather than binary allow/block logic.

For a deeper dive into the foundational concepts, read our guide on [VPN detection explained](/blog/vpn-detection-explained). If you're building proxy detection into your application alongside VPN detection, see [proxy detection techniques](/blog/proxy-detection-techniques) for complementary methods.

---

*This article provides informational content on VPN detection methods. Detection techniques should be used responsibly and in accordance with applicable laws and privacy regulations.*
