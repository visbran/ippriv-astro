---
title: 'What Is a MAC Address and How It Differs from Your IP Address'
description: 'A MAC address is a permanent hardware identifier burned into your device. Learn what it does, how it differs from an IP address, and why it matters for privacy.'
publishedAt: 2026-11-28
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=600&fit=crop'
tags: ['ip address', 'networking', 'privacy']
draft: false
---

## What Is a MAC Address?

A **MAC address** (Media Access Control address) is a unique identifier assigned to the network hardware inside your device. Unlike an IP address, which can change depending on where you connect, a MAC address is baked into the physical network interface card (NIC) when it leaves the factory. It is a 48-bit number, usually written as six pairs of hexadecimal digits separated by colons or hyphens, such as `00:1B:44:11:3A:B7`.

Every device that connects to a network, whether through Ethernet cable or Wi-Fi, has at least one MAC address. Your laptop likely has two: one for the wired Ethernet port and one for the wireless adapter. Smartphones, tablets, smart TVs, printers, and even smart refrigerators all carry one. If a device can send or receive data on a local network, it needs a MAC address to do it.

The Institute of Electrical and Electronics Engineers (**IEEE**) manages the allocation of MAC addresses. The first three pairs of digits in any MAC address identify the manufacturer of the network hardware. This portion is called the **Organizationally Unique Identifier** (OUI). The remaining three pairs are assigned by the manufacturer itself, ensuring that no two network cards in the world share the same address.

## How MAC Addresses Work in Practice

When your device sends data across a local network, it does not use IP addresses to find its destination directly. It uses the MAC address. Here is what happens when you send a file from your laptop to a printer on the same Wi-Fi network.

Your operating system knows the IP address of the printer because you configured it or because a discovery protocol announced it. But the actual data frames that travel across the local network need a Layer 2 address, and that is where the MAC address comes in. Your laptop broadcasts an **ARP** (Address Resolution Protocol) request asking, "Who has this IP address? Tell me your MAC address." The printer responds with its MAC address. Your laptop then packages the data into Ethernet frames addressed to that MAC address, and the printer receives and processes them.

This process happens within milliseconds and repeats constantly on any active local network. If you watch network traffic with a tool like Wireshark, you will see ARP requests and replies flowing back and forth as devices discover each other. Without MAC addresses, your router would have no way to know which physical device on the network should receive a particular packet.

When traffic leaves your local network for the internet, the situation changes. Your router strips away the local MAC address information and forwards the packet using the destination IP address. The next hop router does not care about your laptop's MAC address; it only cares about the IP address of the web server you are trying to reach. This is why MAC addresses operate only within a local area network, while IP addresses handle the broader internet routing.

## MAC Address vs IP Address

The difference between a MAC address and an IP address is one of the most common points of confusion in networking. They serve different purposes at different layers of the network stack.

A **MAC address** is permanent, hardware-level, and local. It identifies the physical device on the same network segment. It does not change when you move to a different coffee shop or connect to a different router. It is assigned by the manufacturer and burned into the network chip.

An **IP address** is logical, temporary in most cases, and global. It identifies your device's location on the internet or within a local subnet. It can change when you reconnect to a different network, when your ISP rotates addresses, or when your router assigns a new DHCP lease. You can read more about how IP addresses function in our guide on [what is an IP address](/blog/what-is-an-ip-address).

Another key distinction is the address space. MAC addresses are 48 bits long, which provides 281 trillion possible combinations. That sounds like a lot, but the IEEE has already warned that the pool could run low in the future. IP addresses, especially IPv6, use 128 bits and offer a vastly larger space. The two addressing systems complement each other: MAC addresses handle physical delivery on local networks, while IP addresses handle logical routing across the global internet.

## Types of MAC Addresses

Not every MAC address you encounter is burned into silicon. Modern operating systems and network stacks use several categories of MAC addresses depending on the context.

### Universal MAC Addresses

A **universally administered address** (UAA) is the factory-assigned MAC address we have discussed so far. It is globally unique and registered with the IEEE. This is the default address your device uses unless you or the operating system overrides it.

### Locally Administered Addresses

A **locally administered address** (LAA) is one that software assigns to override the factory default. Network administrators sometimes use LAAs to organize devices by function or department. Your operating system can also generate an LAA for temporary use. These addresses have a specific bit set in the first byte to signal that they are not globally unique.

### Randomized MAC Addresses

Modern smartphones and laptops increasingly use **MAC address randomization** to protect privacy. Instead of broadcasting the real MAC address when scanning for Wi-Fi networks, the device generates a temporary, random MAC address. This prevents tracking networks from building a long-term history of your movements based on your hardware identifier. Apple introduced this feature in iOS 8, and Android followed suit in Android 10. When the device actually connects to a network, it may still use its real MAC address or continue using a randomized one, depending on your settings.

## Can You Change Your MAC Address?

Technically, yes. Practically, it depends on your device and your skill level.

On most operating systems, the MAC address is not truly read-only. Windows, Linux, and macOS all allow you to spoof or change the MAC address through software. The network driver simply tells the hardware to use a different address in its outgoing frames. The factory address is still stored in the hardware, but the operating system can override it.

On **Linux**, you can change the MAC address with a single command: `sudo ip link set dev eth0 address 00:11:22:33:44:55`. The change lasts until you reboot or manually revert it. On **macOS**, the process is similar but requires you to disable the interface first. On **Windows**, you can change the MAC address through the device manager or the registry, depending on the network card driver.

However, there are limits. Some network interface cards ignore software overrides and always use their factory address. Additionally, many corporate and university networks use **802.1X port-based authentication**, which registers your MAC address when you first connect. Changing your MAC address on such a network will disconnect you until you re-authenticate.

## MAC Address and Privacy

MAC addresses were never designed with privacy in mind. They were created in an era when network hardware was expensive and relatively rare. Today, with billions of Wi-Fi-enabled devices in pockets and homes, the permanent nature of MAC addresses creates a tracking risk.

### Wi-Fi Tracking in Retail and Public Spaces

Retail stores, shopping malls, airports, and city centers have deployed **Wi-Fi probe request sniffers** for years. These devices listen for the signals your phone broadcasts when searching for available networks. Even if you do not connect to anything, your phone regularly sends out probe requests containing your MAC address. By placing sensors across a building or a city, operators can track how individuals move through space, how long they linger in front of a store display, and which paths they take.

This tracking works because your MAC address does not change. A sensor at the entrance logs your MAC address at 10:00 AM, and a sensor at the food court logs the same MAC address at 10:30 AM. The operator now knows your path through the mall. The data is usually anonymized and aggregated before analysis, but the raw data exists and the technique has been documented since at least 2013.

### How Randomization Helps

MAC address randomization disrupts this tracking model. If your phone uses a different random MAC address every fifteen minutes, the sensors cannot link your movements across time. The Wi-Fi Alliance and major operating system vendors have pushed randomization as a standard privacy feature.

Randomization is not perfect. Researchers have found flaws in early implementations where the randomization could be predicted or where the real MAC address leaked during certain network operations. However, the technique has improved significantly, and modern devices generally provide effective protection against passive Wi-Fi tracking.

### The Limits of MAC Address Privacy

Even with randomization, your MAC address is visible to the network you actually connect to. Your home router sees your real MAC address. Your employer's Wi-Fi sees your real MAC address. If you log into a captive portal at a hotel or airport, that system can record your MAC address alongside whatever email or phone number you provide.

MAC address privacy is therefore a local network concern, not an internet-wide one. Once your traffic leaves the router, the internet at large does not see your MAC address. If you want to hide your identity from websites and online services, you need to worry about your IP address, not your MAC address. Tools like VPNs and proxies operate at the IP layer. Our [IP lookup tool](/ip-lookup) shows you exactly what the internet sees when you browse.

## How to Find Your MAC Address

If you need to register a device on a network, whitelist a gaming console, or troubleshoot a connection, you will often need to locate your MAC address.

On **Windows**, open a command prompt and run `ipconfig /all`. Look for the "Physical Address" field under your active network adapter. On **macOS**, open System Settings, navigate to Network, click the active interface, then click Details. The MAC address is listed there. On **Linux**, run `ip link` or `ifconfig` and look for the "ether" field.

On **iOS**, go to Settings > General > About and find the Wi-Fi Address entry. On **Android**, go to Settings > About Phone > Status and look for the Wi-Fi MAC address. Some Android skins hide this behind additional menus, so you may need to search within your device's settings app.

For **gaming consoles**, the MAC address is usually in the network settings menu. On a **smart TV** or streaming device, check the network or connection settings screen.

## What to Do Now

You do not need to memorize your MAC address, but you should understand what it does and what it does not do.

Your MAC address identifies your hardware on local networks. It is permanent, manufacturer-assigned, and invisible to the wider internet. It is useful for local network management, router access controls, and troubleshooting. It is also a potential tracking vector in public spaces, which is why modern devices randomize it.

Your **IP address** is the identifier that matters online. Websites see it. Advertisers use it for geolocation. It changes when you switch networks. If you want to understand what the internet knows about your connection, start by checking your public IP address on our [IP lookup page](/ip-lookup). For developers who need to integrate network data into their applications, our [API documentation](/api-docs) provides endpoints for IP geolocation, VPN detection, and more.
