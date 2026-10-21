---
title: "What Is NAT and How It Works"
description: "Network Address Translation lets every device on your home network share one public IP. Learn how NAT works, its types, and what they mean for your privacy."
publishedAt: 2026-10-21
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=600&fit=crop'
tags: ['nat', 'networking', 'ip-address', 'privacy', 'security']
draft: false
---

Every device on your home network, from your laptop to your smart thermostat, needs an **IP address** to communicate with the internet. Yet your Internet Service Provider usually assigns you only one **public IP address**. Network Address Translation, or **NAT**, is the mechanism that lets dozens of devices share that single address without conflict. If you have ever wondered why your router has one address facing the internet and a completely different set of addresses on the inside, NAT is the reason.

## Why NAT Exists

The internet runs on two versions of the Internet Protocol: **IPv4** and **IPv6**. IPv4 uses 32-bit addresses, which gives a theoretical maximum of about 4.3 billion unique addresses. That sounded like plenty in the 1980s, but it is not enough for the number of devices online today. Engineers developed several solutions to this shortage, including the transition to IPv6, but the most immediate and widely deployed fix was NAT.

NAT was standardized in **RFC 1631** in 1994 as a short-term measure to conserve IPv4 addresses. It works by letting an entire local network use a private IP address range that is not routable on the public internet. The **NAT device**, usually your router, rewrites the source address on outgoing packets to its own public IP. When replies come back, it translates the destination address back to the correct private IP and forwards the packet to the right device. The protocol was never intended as a security mechanism, but it has a side effect that obscures the internal layout of your network from the outside world.

## Public vs Private IP Addresses

To understand NAT, you first need to know the difference between public and private addresses. A **public IP address** is globally unique and reachable from anywhere on the internet. A **private IP address** is used only inside a local network and is not reachable directly from the outside. The ranges reserved for private use are defined in **RFC 1918**:

- 10.0.0.0 to 10.255.255.255
- 172.16.0.0 to 172.31.255.255
- 192.168.0.0 to 192.168.255.255

Your router assigns private addresses to your devices using **DHCP**. When your phone requests a website, the packet leaves with your phone's private IP as the source. The NAT-enabled router swaps that private source address for its public address before sending the packet onward. The web server sees the router's public IP, not your phone's private one. You can see which public IP your ISP has assigned you by visiting our [IP lookup tool](/ip-lookup).

This separation is why two neighbors can both have a device at 192.168.1.10 without any collision. Those addresses exist in isolated local networks and are never exposed to the global routing table.

## How NAT Works in Practice

NAT operates at the network layer, typically inside your router's firmware. When a device sends a packet to the internet, the router creates an entry in a **translation table**. This entry records the private IP address and source port of the original packet, maps them to the router's public IP address and a unique source port, and notes the destination IP and port.

When the response arrives, the router looks at the destination port on the incoming packet, searches the translation table for a matching entry, rewrites the destination address and port to the original private ones, and forwards the packet to the correct local device. If no matching entry exists, the packet is dropped. This stateful behavior means NAT is not a simple address rewriter; it is a connection tracker.

For **TCP** connections, the entry stays in the table until the connection closes or a timeout expires. For **UDP**, which is connectionless, the router keeps the entry for a configurable timeout period, often a few minutes, in case more packets arrive for that same flow.

The translation table is limited by memory and by the number of available ports. A single public IPv4 address has 65,535 usable ports. Since most outbound connections use ephemeral source ports above 1024, a home router can usually track tens of thousands of simultaneous flows without strain. Enterprise firewalls scale this with more memory and multiple public IPs.

## Types of NAT

NAT is not one single technique. Network administrators use several variants depending on the use case.

### Static NAT

**Static NAT** maps one private IP address to one public IP address on a permanent, one-to-one basis. This is common in corporate networks where a server inside the LAN must be reachable from the internet with a predictable public address. Because the mapping is fixed, no translation table entry needs to be dynamically created for outbound traffic, and inbound traffic can be forwarded without ambiguity. If you want to host a service behind a static NAT mapping, you still need a **firewall rule** to allow the traffic through.

### Dynamic NAT

**Dynamic NAT** maps a private IP to a public IP drawn from a pool of available addresses. The mapping lasts for the duration of the session. Unlike static NAT, the same private device might get a different public IP each time it opens a new outbound connection. Dynamic NAT is useful when an organization owns a block of public IPs but has more internal devices than external addresses. It conserves addresses, but it does not solve the fundamental shortage because it still consumes one public IP per active session.

### Port Address Translation (PAT)

**Port Address Translation**, also called **NAT Overload** or simply **PAT**, is what runs on almost every home router. It maps many private IP addresses to a single public IP address by multiplexing connections through different source ports. Your router remembers that 192.168.1.5:54321 maps to publicIP:40001, while 192.168.1.12:51234 maps to publicIP:40002. Both devices share the same public IP, but the port number distinguishes their traffic.

PAT is the reason a single household can have twenty devices online simultaneously without needing twenty public IP addresses. It is also the type of NAT most likely to cause problems with peer-to-peer applications, because incoming connections from the internet have no translation entry until the internal device first reaches out.

## NAT and Privacy

NAT creates a barrier between your local network and the rest of the internet. An attacker scanning your public IP sees only the router. They cannot directly address your laptop at 192.168.1.10 because that address is meaningless outside your LAN. This obscurity is sometimes mistaken for security, but it is not the same thing. NAT does not inspect traffic, block malicious payloads, or encrypt anything. A **firewall** does that.

NAT also does not anonymize you. Every website you visit still sees your public IP address, which is tied to your ISP and often your approximate geographic area. If you want to hide your public IP from the sites you visit, you need a **VPN** or **proxy**, not NAT. Our article on [how to hide your IP address](/blog/hide-your-ip-address) explains the difference between address masking and local network sharing.

Law enforcement or copyright enforcement agencies can still trace activity back to a household by asking the ISP which customer was assigned a specific public IP at a specific time. NAT only hides which device inside the house made the request. If your ISP assigns the same public IP to hundreds of customers using **Carrier-Grade NAT**, the trail ends at a shared pool, which is why CGNAT complicates both abuse reporting and port forwarding. We cover that in our article on [what is CGNAT](/blog/what-is-cgnat).

## Common Problems Caused by NAT

NAT works well for client-to-server traffic, where your device initiates the connection to a website or email server. It becomes problematic when you need another device on the internet to initiate a connection to you.

### Port Forwarding

If you run a game server, a security camera, or a home automation hub, you need external devices to reach a specific private IP inside your network. **Port forwarding** is the manual workaround. You log into your router, create a rule that says "forward incoming traffic on port 8080 to 192.168.1.50," and the router creates a persistent translation entry. This works, but it exposes that internal device to direct probes from the internet, which is why you should restrict port forwarding to the minimum necessary ports and keep the device's firmware updated.

### Gaming and Peer-to-Peer

Online games and peer-to-peer file sharing often use **UDP hole punching** to establish direct connections between two users both sitting behind NAT. Both devices first contact a central server, which shares their public IP and port information. Each device then sends a packet to the other's public address. If the NAT router has a reasonably open behavior, it accepts the reply because it matches a recently sent outbound packet.

Some routers use **Symmetric NAT**, where the source port is randomized differently for each destination. Symmetric NAT breaks UDP hole punching because the port the peer sees is not the same port the router expects for return traffic from that specific destination. Gamers often see "Strict NAT" or "Type 3 NAT" warnings in this situation. The fix is usually to enable **UPnP** on the router, which lets devices request temporary port mappings automatically, or to configure a **DMZ** or port forwarding rule for the gaming console. Be aware that UPnP has its own security history; opening ports automatically is convenient but not risk-free.

### VoIP and Video Calls

**Voice over IP** and video conferencing protocols often embed IP addresses inside the application data, not just in the packet headers. NAT changes the header but cannot rewrite the payload without help. Protocols like **SIP** and **H.323** use **Application Layer Gateways** inside routers to inspect and rewrite these embedded addresses. If the ALG is buggy or disabled, calls may connect but produce no audio, or fail to ring. Disabling SIP ALG is a common troubleshooting step for VoIP issues, but it requires the VoIP provider to use NAT-aware techniques like **STUN** and **TURN** servers instead.

## NAT vs CGNAT

Traditional NAT sits inside your home or office router and translates one public IP to many private IPs. **Carrier-Grade NAT** moves that translation upstream to the ISP's own infrastructure. Hundreds or thousands of customers share a single public IPv4 address, making port forwarding impossible and complicating any service that needs an inbound connection.

CGNAT exists because even with traditional NAT, ISPs were running out of IPv4 addresses to assign to each customer. If your public IP starts with 100.64.x.x to 100.127.x.x, you are likely behind CGNAT. That range is reserved specifically for CGNAT use in **RFC 6598**. The privacy implications are interesting: because many households share one public IP, a website cannot reliably distinguish individual users by IP alone, which frustrates both tracking and security scoring.

## Checking Your NAT Type

You can determine whether you are behind NAT and what kind by inspecting your device's network settings. On Windows, open a command prompt and run `tracert 8.8.8.8`. If the first hop is 192.168.x.x or 10.x.x.x and the second hop is a public address, you are behind NAT. On a gaming console, the network test usually reports NAT Type 1 (open, no NAT), Type 2 (moderate, behind NAT), or Type 3 (strict, symmetric or restrictive NAT).

Some websites and tools perform STUN-based tests to classify your NAT behavior by attempting to establish direct connections through your router. These tests can tell you whether your router preserves ports, maps them consistently, or changes them per destination.

## The Future of NAT

IPv6 was designed to remove the need for NAT entirely. With 128-bit addresses, every device can have its own globally unique IP. Early IPv6 evangelists argued that NAT would disappear. In practice, IPv6 deployments often still use **IPv6 Prefix Delegation** and local subnetting, and many networks run **NAT64** to let IPv6-only devices reach IPv4-only servers. Some security architects also argue that NAT's obscurity, while not real security, still reduces the attack surface by making internal topology invisible.

For the foreseeable future, most home and small-business networks will continue to use PAT on IPv4 while gradually adopting IPv6 alongside it. Understanding how NAT works helps you diagnose connection problems, configure port forwarding safely, and evaluate whether your current setup meets your actual needs.
