---
title: 'How to Find the IP Address of a Website'
description: 'Learn how to find the IP address behind any website using ping, nslookup, dig, and online tools. Understand what the result means for privacy and security.'
publishedAt: 2026-11-11
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop'
tags: ['ip lookup', 'dns', 'networking', 'developer guide']
draft: false
---

Every website you visit resolves to an IP address. That translation from human-readable domain name to numeric address happens behind the scenes through DNS, and most users never need to think about it. But when a site fails to load, when you suspect a DNS spoofing attack, or when you need to whitelist a service on a corporate firewall, knowing how to find a website's IP address becomes a practical skill.

This guide covers four reliable ways to look up a website's IP, what to do when the answer is not straightforward, and how to interpret the results without making dangerous assumptions.

## Why You Might Need a Website's IP Address

There are legitimate, everyday reasons to look up the IP behind a domain.

**Troubleshooting connectivity.** If a website is unreachable from your home connection but loads fine on your phone's mobile network, the problem may be DNS-related. Looking up the IP and accessing it directly tells you whether the issue is name resolution or routing.

**Verifying CDN and proxy coverage.** Many sites route traffic through Cloudflare, Akamai, or AWS CloudFront. The IP you resolve may belong to the CDN edge server rather than the origin. Knowing the difference helps network engineers and security researchers trace where traffic actually terminates.

**Firewall and access control.** Corporate networks, parental control filters, and intrusion-detection systems often work at the IP level. If you need to allow or block a specific service, the domain name alone is not enough; you need the underlying addresses.

**Threat investigation.** Security analysts look up IPs to check reputation data, geolocation, and ASN ownership. A suspicious domain may resolve to an IP range associated with known malicious activity. Our guide on [reverse IP lookup](/blog/reverse-ip-lookup) explains how to trace from an address back to its registered hostname.

## Method 1: Using Ping

The simplest way to find a website's IP is to use the built-in **ping** command. Ping sends an ICMP echo request to the target and, in the process, performs a DNS lookup that reveals the IP address.

On Windows, macOS, or Linux, open a terminal and run:

```
ping example.com
```

The first line of output will look something like this:

```
Pinging example.com [93.184.216.34] with 32 bytes of data:
```

The number in brackets is the IPv4 address associated with the domain at that moment. On Linux and macOS, ping runs continuously until you press Ctrl+C. On Windows, it sends four packets by default and stops.

**Limitations.** Many servers block ICMP traffic for security reasons. If ping returns "Request timed out" or "Destination host unreachable," the IP may still have resolved correctly. The lack of a reply does not mean the address is wrong. For a more detailed explanation of how addresses are assigned and why they change, see our article on [how ISPs assign IP addresses](/blog/how-isps-assign-ip-addresses).

## Method 2: Using nslookup

**nslookup** is a dedicated DNS query tool available on every major operating system. It is more informative than ping because it queries your configured DNS server directly and shows exactly what record was returned.

Open a terminal or command prompt and type:

```
nslookup example.com
```

You will see output like this:

```
Server:  192.168.1.1
Address: 192.168.1.1#53

Non-authoritative answer:
Name:    example.com
Address: 93.184.216.34
```

The "Server" line tells you which DNS resolver handled the query, typically your router or your ISP's DNS server. The "Non-authoritative answer" means the result came from the resolver's cache rather than directly from the domain's authoritative nameservers. The "Address" line is the IP you need.

You can also query a specific record type. To find the IPv6 address:

```
nslookup -type=AAAA example.com
```

Or to query a different DNS server directly:

```
nslookup example.com 8.8.8.8
```

This bypasses your local resolver and asks Google's public DNS for the answer. If the results differ, your local DNS may be caching an old record or filtering responses.

## Method 3: Using dig

**dig** (Domain Information Groper) is the most detailed command-line DNS tool. It is installed by default on most Linux distributions and macOS. Windows users can install it through BIND or WSL.

Run:

```
dig example.com
```

The output includes several sections:

- **QUESTION SECTION:** Confirms what you asked for.
- **ANSWER SECTION:** Lists the DNS records returned. Look for the A record (IPv4) or AAAA record (IPv6).
- **Query time:** Tells you how long the lookup took.
- **SERVER:** Shows which DNS resolver answered.

A typical answer looks like this:

```
;; ANSWER SECTION:
example.com.		86400	IN	A	93.184.216.34
```

The number 86400 is the TTL (Time To Live), measured in seconds. It tells you how long the DNS resolver will cache this result before asking again. A low TTL (under 300 seconds) often indicates the operator expects the address to change soon, a common setup for load balancing or disaster recovery.

You can also request specific details:

```
dig +short example.com
```

This returns only the IP address, which is useful for scripting.

## Method 4: Online Lookup Tools

If you prefer not to use the command line, many web-based tools resolve domains to IPs. These tools perform the same DNS queries you would run locally but present the results in a browser. They are convenient when you are on a locked-down machine or need to share results with a colleague.

Keep in mind that the IP returned by an online tool depends on the DNS resolver that tool uses. If the website employs geographic load balancing, an online tool running in a different country may return a different IP than your local lookup.

For programmatic access or integration into your own workflow, you can use our [IP lookup tool](/ip-lookup) or query our [API documentation](/api-docs) to resolve and analyze addresses at scale.

## When the IP Is Hidden or Changes

Modern web infrastructure often makes a single IP answer misleading.

**Content Delivery Networks (CDNs).** Services like Cloudflare, Fastly, and Akamai sit between the user and the origin server. When you look up a Cloudflare-protected domain, you get an IP address belonging to Cloudflare's edge network, not the actual web server. The origin IP is deliberately concealed to absorb DDoS traffic and filter malicious requests. If you need the real origin, you must look beyond standard DNS, though doing so without permission crosses ethical and legal lines.

**Geographic load balancing.** Large platforms run different servers in different regions. A user in Frankfurt may resolve to an IP in Frankfurt, while a user in Tokyo resolves to Tokyo. Running a lookup from your own location only reveals the address your region was assigned.

**Dynamic scaling.** Cloud providers like AWS, Azure, and Google Cloud spin up and tear down instances based on demand. The IP address for a domain can change within minutes, especially if the site uses auto-scaling groups or Kubernetes ingress controllers.

If you encounter conflicting results, compare lookups from multiple locations and DNS resolvers. Tools that query from distributed nodes give a more accurate picture than a single local request. Our article on [IP address location accuracy](/blog/ip-address-location-accuracy) explains why geographic variance in DNS responses is normal and expected.

## What You Can and Cannot Do With the Result

Finding a website's IP address is legal and routine. What you do next determines whether you stay on the right side of the law and terms of service.

**You can** run ping and traceroute to test routing, perform a WHOIS lookup to see ownership data, and configure firewalls or monitoring tools to recognize the address. These are standard network administration tasks.

**You cannot** probe the server for vulnerabilities, launch denial-of-service attacks, or attempt to bypass access controls simply because you know the IP. Many jurisdictions treat unauthorized access attempts as criminal offenses regardless of whether you used a domain name or an address.

**You also cannot** determine a website operator's physical location from the IP alone. The address may belong to a hosting provider in another country, a CDN node, or a cloud region that spans multiple data centers. For a refresher on what an IP address actually reveals, read our guide on [what is an IP address](/blog/what-is-an-ip-address).

## How to Automate the Lookup

If you regularly check website IPs, automation saves time. A simple Bash script resolves a list of domains and prints the results:

```bash
#!/bin/bash
for domain in example.com google.com github.com; do
  echo -n "$domain: "
  dig +short "$domain"
done
```

For Python users, the socket library provides the same functionality:

```python
import socket
print(socket.gethostbyname('example.com'))
```

Neither method handles IPv6 by default. For AAAA records, use a DNS-specific library like dnspython.

Automation is especially useful when you monitor dozens of domains for infrastructure changes. Store the expected IPs and compare them daily. A sudden change may indicate a migration, a compromise, or a DNS configuration error.

## When to Check Again

An IP address lookup is a snapshot, not a permanent record. Re-check in these situations.

**After a site migration.** When a website moves from one host to another, its DNS records change. The old IP may still work for a while if the previous host keeps a redirect, but it will eventually stop.

**During a security incident.** If a domain is hijacked or its DNS is poisoned, the resolved IP may point to an attacker-controlled server. Comparing the current address to a known-good baseline is a quick first step in incident response.

**When regional blocking is suspected.** If a service works for your colleague in another city but fails for you, the regional CDN node assigned to your resolver may be down or blacklisted. A lookup confirms whether you are hitting the same infrastructure.

## What to Do Now

Pick one of the methods above and try it on a domain you manage. Compare the IP from your home connection, your mobile network, and an online tool. If the results differ, you are likely seeing the effects of a CDN or geographic load balancing. That is normal, but it means you should not hard-code the address into scripts or firewall rules without a plan for updates.

If you need to resolve addresses programmatically or enrich them with geolocation and reputation data, use our [IP lookup tool](/ip-lookup) or review the [API documentation](/api-docs) to integrate the lookup into your own systems.
