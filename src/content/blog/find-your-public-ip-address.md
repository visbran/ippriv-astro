---
title: 'Find Your Public IP Address: 4 Quick Methods (Any Device)'
description: 'Find your public IP address in seconds. Methods: browser tool, curl terminal command, dev tools, and mobile. Includes IPv4 vs IPv6 guide.'
publishedAt: 2025-02-10
updatedAt: 2026-05-03
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop'
tags: ['ip address', 'ip lookup', 'tutorial']
draft: false
---

## Public vs. Private IP Addresses

Before finding your IP address, it helps to understand which type you are looking for. Every internet-connected device actually has two IP addresses: a private IP address and a public IP address.

Your **private IP address** is assigned by your router and is only visible within your local network. Devices on the same Wi-Fi network can see each other using private IP addresses, but these addresses are not routable on the public internet. Common private IP address ranges include `192.168.x.x`, `10.x.x.x`, and `172.16.x.x` to `172.31.x.x`.

Your **public IP address** is the address assigned to your router by your Internet Service Provider (ISP). This is the address that websites, servers, and services see when you connect to them. It is shared across all devices on your network — your laptop, phone, and smart TV all appear to use the same public IP address when accessing the internet.

When most people ask "what is my IP address," they are asking about their public IP address. That is what this guide covers.

## Method 1: Use IPPriv (Fastest, No Setup Required)

The simplest way to find your public IP address is to visit [ippriv.com](https://ippriv.com). The tool detects your IP address automatically the moment you load the page — no input, no registration, no setup required.

For a more detailed analysis of your connection, including VPN, proxy, and Tor detection, check out our [IP lookup tool](/ip-lookup).

IPPriv displays your current public IP address along with additional information about your connection:

- Whether you have an IPv4 or IPv6 address (or both)
- Your approximate geographic location (city, region, country)
- Your ISP and organization name
- Connection type indicators such as VPN or proxy detection

This method works on any device with a browser — desktop, laptop, tablet, or smartphone. It is also the most accurate method because it shows exactly what external servers see when you connect.

If you are testing a VPN connection, IPPriv is a reliable way to verify that your apparent IP address has actually changed before and after connecting.

## Method 2: Terminal Command (curl)

If you prefer the command line, or if you are working on a server without a graphical interface, you can find your public IP address in seconds using `curl`.

**On macOS or Linux:**

```bash
curl https://api.ippriv.com/ip
```

This sends a request to the IPPriv API and returns your public IP address as plain text. It is clean, fast, and easily scriptable.

You can also use other public IP echo services:

```bash
curl ifconfig.me
curl icanhazip.com
curl ipinfo.io/ip
```

**On Windows (PowerShell):**

```powershell
(Invoke-WebRequest -Uri "https://api.ippriv.com/ip").Content
```

Or using the built-in `curl` alias in modern PowerShell:

```powershell
curl https://api.ippriv.com/ip
```

The terminal method is particularly useful for developers, system administrators, and anyone who needs to check or log IP addresses as part of an automated process or script.

**Pro tip:** If you want your full IP address information in JSON format — including location, ISP, and other metadata — use:

```bash
curl https://api.ippriv.com/json
```

This returns a structured response you can parse programmatically or pipe into tools like `jq` for filtering.

## Method 3: Browser Developer Tools

Your browser's built-in developer tools can reveal your IP address in certain situations, and they also let you inspect what information websites see when you connect.

**How to use it:**

1. Open your browser (Chrome, Firefox, Edge, or Safari).
2. Press `F12` (or `Cmd + Option + I` on macOS) to open developer tools.
3. Navigate to the **Network** tab.
4. Visit any website or refresh the current page.
5. Click on a network request and look at the request and response headers.

Some websites include your IP address in response headers or expose it in API responses visible through the Network tab. However, this method is indirect — you are observing what a server echoes back, not reading your IP directly from the browser.

A more direct approach: navigate to `https://ippriv.com` with the developer tools open and inspect the JSON response from the API endpoint. You will see your full IP address and metadata in the response body.

This method is best for developers who are already working in the browser's devtools and want to understand what request information is being transmitted.

## Method 4: On Mobile Devices

Finding your public IP address on a smartphone is easy, and the method is the same regardless of whether you are on iOS or Android.

**Using a browser (recommended):**

Open any browser on your phone and visit [ippriv.com](https://ippriv.com). Your public IP address will be displayed immediately. This works identically to the desktop browser method.

**Note about mobile IP addresses:** When connected to Wi-Fi, your phone uses your home or office network's public IP address — the same one your laptop uses. When connected to cellular data (4G or 5G), your phone is assigned an IP address from your mobile carrier's pool. Mobile carriers frequently use Carrier-Grade NAT (CGNAT), which means many customers share a single public IP address and the address displayed may not be uniquely yours.

This distinction matters for geolocation purposes: cellular IP addresses often resolve to your carrier's regional hub rather than your specific city.

## Why Your IP Address Changes

Many people are surprised to discover that their public IP address is not fixed. For most home internet connections, the IP address assigned by the ISP is **dynamic** — it changes periodically.

Your IP address can change when:

- Your router is restarted or loses power
- Your ISP's DHCP lease expires and is renewed
- Your ISP rotates addresses in their pool
- You switch from Wi-Fi to cellular data (or vice versa)
- You connect through a VPN, which replaces your IP address with one from the VPN provider's pool

If you need a stable, permanent IP address — for running a home server, remote access, or consistent IP-based authentication — you would need to request a **static IP address** from your ISP. This typically costs extra and is more common for business internet plans.

## IPv4 vs. IPv6: Which Address Will You See?

Depending on your ISP and router configuration, you may have an IPv4 address, an IPv6 address, or both.

**IPv4 addresses** look like `203.0.113.45` — four groups of numbers separated by dots. This is the traditional format and is still the most commonly used type on the public internet.

**IPv6 addresses** look like `2001:db8:85a3::8a2e:370:7334` — eight groups of hexadecimal values separated by colons. IPv6 was developed to address the exhaustion of IPv4 addresses and is increasingly supported by ISPs and websites.

When you visit IPPriv, the tool detects which protocol your browser used to connect and displays the appropriate address. If your network supports both (a configuration called dual-stack), you may see both addresses listed. This is normal and indicates your network is fully modern and compatible with all internet services.

If you are a developer integrating IP lookup into an application, make sure your code handles both IPv4 and IPv6 address formats correctly. The IPPriv API returns a `version` field in its JSON response indicating which type of address was detected.

## Quick Reference

| Method | Best For | Requires |
|--------|----------|----------|
| IPPriv website | Anyone, any device | Browser |
| curl command | Developers, servers | Terminal |
| Browser devtools | Web developers | Browser + devtools |
| Mobile browser | Phones and tablets | Browser app |

No matter which method you use, knowing your public IP address is the first step toward understanding your internet footprint. Use [IPPriv](https://ippriv.com) for the fastest, most informative ip lookup available.

For a deeper dive into how IP addresses work and what they reveal, read our guide on [what is an IP address](/blog/what-is-an-ip-address).
