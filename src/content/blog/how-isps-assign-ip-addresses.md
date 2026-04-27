---
title: 'How ISPs Assign IP Addresses to Their Customers'
description: 'Learn how Internet Service Providers assign IP addresses using DHCP, NAT, and IP pools — and what this means for IP lookup accuracy.'
publishedAt: 2025-04-14
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop'
tags: ['ip address', 'ISP', 'networking']
draft: false
---

## The Role of ISPs in IP Address Allocation

Every device that connects to the internet needs a public IP address. But individual users do not go out and acquire their own IP addresses — that process happens through a chain of allocation that starts at the global level and ends with the IP address your router currently holds.

At the top of the chain are the Regional Internet Registries (RIRs): ARIN (North America), RIPE NCC (Europe and Middle East), APNIC (Asia-Pacific), LACNIC (Latin America), and AFRINIC (Africa). These organizations receive large blocks of IP addresses from IANA (the Internet Assigned Numbers Authority) and distribute them to Internet Service Providers within their regions.

Your ISP receives one or more of these IP address blocks — sometimes millions of addresses in a single allocation — and takes responsibility for assigning addresses from that pool to its customers. The mechanics of how that assignment happens, and when it changes, have significant implications for how accurately an IP lookup can identify a user's location.

## DHCP: The Standard Assignment Mechanism

Most residential customers receive their IP address through DHCP — the Dynamic Host Configuration Protocol. When your router connects to your ISP's network, it broadcasts a request for an IP address. The ISP's DHCP server responds by assigning an available address from its pool, along with a lease duration.

The lease duration is key. A DHCP lease is a temporary assignment — the IP address is yours for a defined period, typically 24 hours to several days for residential customers. When the lease expires, your router requests a renewal. If you are actively connected, you will usually receive the same IP address again. But if you disconnect for an extended period, that address may be returned to the pool and assigned to another customer.

This is why residential IP addresses are described as "dynamic" — they can and do change. The address you have today may belong to a different household next month. This rotation is not random or malicious; it is simply how ISPs efficiently share a finite pool of IP addresses across a large subscriber base.

## IP Pools and Address Rotation

An ISP's IP pool is the set of available addresses it has to assign to customers at any given time. Because not all subscribers are connected simultaneously, the ISP does not need a unique IP address for every customer — it only needs enough addresses to cover peak concurrent connections. This is called statistical multiplexing.

As customers connect and disconnect throughout the day, their IP addresses cycle back into and out of the available pool. A customer who disconnects their router for a weekend may find they have a different IP address when they reconnect Monday morning — the address they held previously was reassigned to someone else during the gap.

For IP lookup accuracy, this creates a fundamental challenge: geolocation databases associate IP addresses with locations, but those associations are made at the block level, not the individual address level. The database knows that a block of IP addresses belongs to a particular ISP operating in a particular city. When an address from that block is assigned to a residential customer, the geolocation information reflects the ISP's network infrastructure location — not the customer's physical home address.

## CGNAT: When Many Users Share One IP

The scarcity of IPv4 addresses has pushed many ISPs to deploy Carrier-Grade NAT (CGNAT), also called Large-Scale NAT (LSN). Under CGNAT, the ISP assigns its customers private IP addresses from a reserved range (typically 100.64.0.0/10, defined in RFC 6598), and then uses a centralized NAT gateway to translate those private addresses into a single shared public IP address for outbound traffic.

The result is that hundreds or even thousands of customers may appear to the internet as the same public IP address at any given time. From the perspective of a web server looking up that IP address, it sees a single IP that could represent a massive number of different users, households, and geographic locations.

CGNAT has several important implications:

**IP lookup accuracy degrades.** When thousands of users share a single public IP address, geolocation data for that IP reflects the location of the CGNAT gateway — typically an ISP data center or regional network hub — not any individual user's location. An IP lookup on a CGNAT address might place the user in a completely different city from their actual location.

**IP-based rate limiting becomes problematic.** Security systems that rate-limit by IP address will incorrectly group thousands of legitimate users together, either blocking legitimate traffic or failing to rate-limit effectively because the "offending" address is spread across too many users to identify a genuine bad actor.

**IP-based blocking has collateral damage.** Blocking a CGNAT IP address blocks every customer sharing that public address, which may include thousands of innocent users along with the one causing problems.

## Static IP Assignments for Business Customers

While residential customers typically get dynamic DHCP-assigned addresses, business customers often pay a premium for static IP address assignments. A static IP address does not change — it is permanently assigned to a specific customer's account and remains in use as long as they maintain their service contract.

Static IPs are valuable for businesses that:

- Run their own servers (web, email, VPN) and need a consistent address for DNS records
- Use IP-based whitelisting to access financial systems, vendor portals, or corporate networks
- Need consistent IP addresses for security auditing and firewall rules
- Operate remote access infrastructure that employees connect to from outside the office

Because static IPs are assigned to a specific business at a specific location for extended periods, IP lookup data for static business IP addresses tends to be more accurate than residential dynamic addresses. The geolocation database has stable, consistent information to work with.

## What This Means for IP Lookup Accuracy

Understanding how ISPs assign IP addresses explains a lot about why IP lookup results are imprecise for residential users:

**City-level accuracy reflects network infrastructure, not home addresses.** An IP lookup on your home IP address will return your ISP and a city — but that city is typically where the ISP has its nearest network hub or DHCP server, not necessarily where you live. In dense urban areas, this is often accurate. In rural areas or regions served by centralized infrastructure, the discrepancy can be significant.

**CGNAT makes individual-level geolocation impossible.** If your ISP uses CGNAT, IP lookup simply cannot identify your location from your public IP address. The public IP belongs to the ISP's gateway, not to you.

**Dynamic addresses leave stale data.** When an IP address is reassigned to a new customer in a different city, geolocation databases may take days or weeks to reflect the change. During that window, an IP lookup returns the previous customer's approximate location.

## Identifying Your ISP Through IP Lookup

Despite these limitations, IP lookup reliably identifies your ISP regardless of whether your address is dynamic, static, or behind CGNAT. The ISP information comes from the ASN record associated with the IP block, which changes only when ownership of the block changes — not when individual addresses within the block are reassigned.

IPPriv's geolocation endpoint (`/api/geo/:ip`) returns ISP and organization data alongside location information:

```javascript
const response = await fetch('https://api.ippriv.com/api/geo/YOUR_IP_ADDRESS');
const data = await response.json();

console.log(data.isp);    // e.g., "Comcast Cable Communications"
console.log(data.asn);    // e.g., "AS7922"
console.log(data.city);   // e.g., "Chicago" (ISP hub, not necessarily your city)
console.log(data.country); // e.g., "United States"
```

The ISP field is highly reliable — it reflects who owns the IP block and therefore who is providing the internet service. The city field is a best-effort estimate based on network infrastructure location. For most use cases — country detection, ISP identification, and network categorization — IP lookup provides accurate and actionable information. For precise user location, it is better to request location permission through the browser's Geolocation API rather than inferring it from the IP address.

## Conclusion

ISPs assign IP addresses to customers primarily through DHCP leases drawn from address pools, with addresses rotating as customers connect and disconnect. Businesses can pay for static IP addresses that remain fixed. CGNAT further complicates the picture by allowing many users to share a single public IP address. These assignment mechanisms explain why IP lookup accurately identifies the ISP and country but is less precise at the city level — the data reflects ISP infrastructure, not individual user locations. For developers building applications on top of IP address information, understanding this context leads to more realistic expectations and better application design. Use our [IP lookup tool](/ip-lookup) to see what your own ISP assignment currently reveals, and read our guide on [static vs. dynamic IP addresses](/blog/static-vs-dynamic-ip-address) for more on how assignment type affects lookup results.
