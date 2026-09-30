---
title: 'Public IP vs Private IP Address: What Is the Difference?'
description: 'Learn the difference between public and private IP addresses. Understand RFC 1918 ranges, NAT, and why your router has two addresses.'
publishedAt: 2026-09-30
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=600&fit=crop'
tags: ['ip address', 'networking', 'privacy', 'NAT']
draft: false
---

## Every Device Has an Address

Every device on a network has an IP address. What many people do not realize is that most networks use two different kinds of IP addresses at the same time. Your laptop, your phone, and your smart thermostat all use a **private IP address** that only works inside your home or office. Your router holds a **public IP address** that faces the internet.

Understanding the difference between these two address types explains how modern networks function, why your devices are not directly reachable from the internet, and where privacy risks actually live.

## What Is a Private IP Address?

A private IP address is used only inside a local network. It is not reachable from the internet, and millions of networks around the world can use the exact same private addresses without conflict. This is possible because private IP ranges are reserved for internal use and are never routed on the public internet.

The Internet Engineering Task Force (IETF) defined these ranges in RFC 1918. They are:

- **10.0.0.0 to 10.255.255.255** (10.0.0.0/8) — the largest block, common in enterprise networks
- **172.16.0.0 to 172.31.255.255** (172.16.0.0/12) — used in medium-sized networks
- **192.168.0.0 to 192.168.255.255** (192.168.0.0/16) — the block almost every home router uses

If you open your network settings and see an address like 192.168.1.45 or 10.0.0.23, that is your private IP. It identifies your device to your router and to other devices on your Wi-Fi network, but it means nothing to a server on the other side of the world.

## What Is a Public IP Address?

A public IP address is assigned by your internet service provider and is visible to any device on the internet. When you visit a website, that website sees your public IP address, not your private one. Your public IP is the return address that servers use to send data back to your network.

Public IP addresses are globally unique and registered with regional internet registries such as ARIN, RIPE NCC, and APNIC. Your ISP receives blocks of public IPs from these registries and assigns one to your connection. If you use a VPN, the public IP address changes to that of the VPN server.

You can see your current public IP address and what it reveals about your location and ISP by using our free [IP lookup tool](/ip-lookup).

## Why Networks Need Both

The internet was built on IPv4, a protocol that uses 32-bit addresses. This creates a theoretical maximum of roughly 4.3 billion unique addresses. In the early days of the internet, that seemed like more than enough. By the mid-1990s, it was clear that every desktop computer, phone, and eventually toaster would need an address, and 4.3 billion would not suffice.

Rather than forcing every household device to consume a public IP address, engineers designed a system where one public IP could serve an entire network of private devices. This is what allows a family of five to have twenty connected devices while the ISP only assigns a single public IP address to the home router.

The same principle applies in corporate environments. A company with thousands of employees and tens of thousands of devices might only need a few dozen public IP addresses. The private address space inside the building is essentially free and unlimited.

## How NAT Bridges the Gap

**Network Address Translation (NAT)** is the mechanism that connects private networks to the public internet. When your laptop sends a request to a website, the packet leaves with your private IP as the source. Your router intercepts the packet, rewrites the source address to the router's public IP, and assigns the connection a temporary port number. When the response comes back, the router uses that port number to forward the data to the correct device on your local network.

This translation happens for every outbound connection. Your router maintains a NAT table that tracks which internal device initiated each conversation. Without NAT, every device would need its own public IP address, and IPv4 would have run out of space decades ago.

NAT also provides a basic layer of security. Because private IP addresses are not routable on the internet, an external attacker cannot directly connect to your laptop or phone unless the router is explicitly configured to forward traffic to that device. This is why port forwarding exists. It punches a hole through NAT to let specific external traffic reach a specific internal device.

For a deeper look at how carriers extend this concept to thousands of customers sharing a single public IP, read our article on [CGNAT](/blog/what-is-cgnat).

## How to Find Your Public and Private IP Addresses

Finding your private IP address is straightforward and does not require any external service.

**On Windows:**
Open Command Prompt and type `ipconfig`. Look for the IPv4 address under your active network adapter. It will likely start with 192.168.

**On macOS:**
Open System Settings, select your active network connection, and view the IP address field.

**On Linux:**
Open a terminal and run `ip addr show` or `hostname -I`. The address starting with 192.168 or 10. is your private IP.

**On Android or iOS:**
Go to Settings, then Wi-Fi, tap the connected network, and look for the IP address field.

Your public IP address is equally easy to find, but you need an external service because it is assigned to your router, not your device. Visit [ippriv.com](https://ippriv.com) to see your public IP, along with your estimated location, ISP, and ASN.

## The Privacy Divide

The privacy implications of public versus private IP addresses are not symmetrical. Your private IP address reveals almost nothing about you. It tells an attacker which subnet you are on, but they already need to be inside your network to see it. Your private IP is not included in web requests, email headers, or server logs.

Your public IP address is a different story. It appears in the logs of every website you visit, every API you call, and every service you use. It can be used to estimate your location, identify your ISP, and in some cases correlate your activity across different sites. When you read our guide on [what an IP address reveals](/blog/what-does-an-ip-address-reveal), the information discussed there applies exclusively to your public IP.

This is why privacy tools focus on masking or replacing your public IP address. A VPN, a proxy, or Tor changes the public IP that websites see. It does not change your private IP, and it does not need to. Your private IP is irrelevant to anyone outside your local network.

## Static and Dynamic Public IPs

Most residential internet connections use dynamic public IP addresses that change periodically. Your ISP assigns an address from its pool when your router connects, and that address may change after a reboot, a network maintenance window, or a lease expiration. Dynamic addressing helps ISPs manage their limited pool of public IPs efficiently.

Business customers and some premium residential plans offer static public IP addresses that do not change. A static IP is useful if you need to host a server, run remote access software, or whitelist your address for security purposes. The tradeoff is that a static IP is easier to track over long periods because it never rotates.

Our guide on [static versus dynamic IP addresses](/blog/static-vs-dynamic-ip-addresses) covers this topic in more detail.

## When the Distinction Matters

The public versus private distinction comes up in several practical situations.

**Troubleshooting network problems.** If a service asks for your IP address to whitelist access or diagnose a connection issue, they mean your public IP. Giving them your 192.168 address will not help.

**Remote access.** If you want to connect to your home computer from the office, you need your public IP address and a port forwarding rule on your router. Your private IP only works once you are already inside the network.

**Gaming and peer-to-peer.** Some multiplayer games and file-sharing applications struggle with NAT because they need direct connections between players. NAT can block incoming connections unless UPnP or manual port forwarding is configured.

**Security scanning.** If you run a vulnerability scan against your public IP address, you are testing your router's external interface and any forwarded ports. Scanning your private IP tests only the devices inside your home.

## IPv6 and the Future of Addressing

IPv6 was designed partly to eliminate the address shortage that made NAT necessary. With 128-bit addresses, IPv6 provides enough unique addresses for every device to have its own globally routable number. In an IPv6-only world, every device could theoretically have a public address, and NAT would not be needed for address conservation.

In practice, IPv6 adoption has been gradual, and dual-stack networks running IPv4 and IPv6 simultaneously are the norm. Many IPv6 networks still use NAT66 for security and network management, even though address exhaustion is no longer the primary driver. The public versus private distinction still matters in IPv6, though the boundary is drawn differently.

If you want to understand how IPv6 handles privacy, our article on [IPv6 privacy extensions](/blog/ipv6-privacy-extensions-explained) explains how temporary addresses prevent long-term tracking.

## What to Check Now

Open your network settings and identify both addresses. Your private IP is the one your router gave you. Your public IP is what the rest of the internet sees. Use our [IP lookup tool](/ip-lookup) to verify your public address and review what it exposes. If you are concerned about the location and ISP data attached to it, consider whether a VPN or proxy fits your use case.
