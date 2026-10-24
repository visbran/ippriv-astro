---
title: 'What Is Split Tunneling and When to Use It'
description: 'Split tunneling lets you route some traffic through a VPN while other traffic uses your regular connection. Learn how it works, the risks, and when it makes sense.'
publishedAt: 2026-10-24
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop'
tags: ['vpn', 'ip-leak', 'privacy', 'networking', 'security']
draft: false
---

A VPN sends all your internet traffic through an encrypted tunnel to a remote server. That is the default behavior, and it is what most users expect. But what happens when you need your real IP address for some tasks and a VPN IP for others? Routing everything through the tunnel can break local network services, slow down traffic that does not need protection, and trigger security alerts on services that flag VPN exit nodes.

**Split tunneling** solves this by letting you choose which applications, domains, or IP ranges use the VPN tunnel and which bypass it entirely. Instead of an all-or-nothing approach, you get selective routing. The concept is simple, but the implementation and the privacy tradeoffs are not. Misconfigured split tunneling is one of the most common causes of accidental IP leaks, and it can undermine the very privacy you installed a VPN to achieve.

## How Split Tunneling Works

At the network layer, split tunneling is a routing decision. Your operating system maintains a routing table that tells each network packet where to go. Without a VPN, your default route sends all traffic to your router, which forwards it to your ISP. With a full-tunnel VPN, the VPN client adds a new default route that sends all traffic through the virtual network interface created by the VPN.

Split tunneling adds rules between these two extremes. The VPN client intercepts outgoing packets and checks them against a policy list. If a packet matches an included application or domain, it goes through the VPN interface. If it matches an exclusion, it goes through your regular network interface. Everything else follows the default rule, which depends on whether the VPN is configured as the default route.

There are three common ways to implement this policy.

**Application-based split tunneling** is the most user-friendly. You open your VPN client and select which programs should use the VPN. Your torrent client and browser might go through the tunnel, while your video conferencing app and local file sync tool use your regular connection. The VPN client identifies traffic by the process that generated it. This works well until the process spawns a subprocess or uses a system service that the VPN client does not recognize.

**URL or domain-based split tunneling** is more granular. Instead of routing an entire application's traffic, you route traffic based on the destination. A corporate VPN might send all traffic to internal company domains through the tunnel while letting employees browse the open web directly. This requires the VPN client to inspect DNS requests or TLS handshakes to determine the intended destination, which adds complexity and can introduce its own privacy risks.

**IP-based split tunneling** is the oldest method and the most reliable at the network level. You define specific IP ranges or subnets that should or should not use the VPN. Corporate networks often use this to route traffic to internal IP ranges through the VPN while sending everything else out directly. The downside is that IP ranges change, and most users do not know the IP addresses of the services they use.

## The Privacy Tradeoff

Split tunneling is a convenience feature, but convenience in networking almost always comes at the cost of security. Every packet that bypasses the VPN exposes your real IP address, your ISP, and your approximate location to the destination server. If you exclude your browser from the VPN to get faster speeds, every site you visit sees your real IP. If you exclude a messaging app, its servers log your real IP. If you exclude your operating system's update service, Microsoft's or Apple's servers see your real IP and your ISP.

The risk is not just about the excluded traffic itself. Websites and services correlate data across sessions. If you log into the same account through both the VPN and your real IP, the service can link the two addresses to the same user. This correlation destroys the anonymity benefit of the VPN for that account, even if the VPN traffic itself never leaked.

Split tunneling also interacts poorly with DNS. If your VPN client routes browser traffic through the tunnel but lets another application use your regular connection, both applications may still share the same DNS resolver. Your ISP's DNS server then sees the domains that your VPN-tunneled browser is requesting, even though the actual traffic is encrypted. For a full breakdown of how DNS leaks happen and how to test for them, read our guide on [how to prevent IP leaks](/blog/how-to-prevent-ip-leaks).

## Common Use Cases

Despite the risks, split tunneling is genuinely useful in specific scenarios. The key is to understand exactly what you are trading away.

**Remote work with corporate resources.** Many companies require that traffic to internal servers, databases, and file shares pass through a VPN for compliance and access control. If that VPN also routes all personal web browsing through the corporate network, the company sees every site you visit, every video you stream, and every search you run. Split tunneling lets you access company resources securely while keeping your personal traffic on your home ISP. The tradeoff is that your employer may mandate full tunneling for regulatory reasons.

**High-bandwidth activities that do not need privacy.** Streaming 4K video from a legitimate service, downloading large game updates, or running cloud backups can saturate a VPN connection and increase latency. If the content is not sensitive and the service already knows who you are, routing it through the VPN adds overhead without benefit. Excluding these applications from the tunnel frees up bandwidth for traffic that actually needs protection. Just remember that the streaming service or game platform now sees your real IP.

**Local network access.** A full-tunnel VPN often breaks connections to devices on your local network, such as printers, network-attached storage, smart home hubs, and security cameras. This happens because your device tries to reach local IP addresses through the VPN tunnel instead of your local router. Split tunneling can exclude local IP ranges so that LAN traffic stays local while internet traffic goes through the VPN. Some VPN clients do this automatically, but many require manual configuration.

**Regional content and local banking.** Users who connect to a VPN server in another country to access content may still need to use local banking or government services that block foreign IPs. Split tunneling can route banking traffic through the regular connection while the browser accesses the foreign content through the VPN. This is convenient, but it also tells the bank your real IP and tells the streaming service your VPN IP, and both services can associate those addresses with your account.

## When Split Tunneling Backfires

Split tunneling is safe only when the exclusion list is correct and complete. In practice, exclusion lists are often incomplete, and the consequences range from mild annoyance to serious exposure.

**Background services leak.** You exclude Chrome from the VPN because you want fast browsing. But Chrome runs background processes for updates, spell checking, and account sync. Your VPN client may not catch all of them. One background request to Google with your real IP while you are logged into a VPN-protected session is enough to correlate the two addresses.

**Misconfigured DNS.** You route your browser through the VPN but leave DNS on the default resolver. Your ISP sees every domain you visit, and your VPN provider's anti-logging policy does not apply to those queries. Some VPN clients force all DNS through the tunnel regardless of split tunneling settings, but many do not. You can verify your DNS leak status by running a test while connected to your VPN.

**WebRTC and other protocols.** WebRTC can leak your local IP address even when the VPN is active. If you also have split tunneling configured, the leak becomes more severe because your real public IP may also escape. For background on how WebRTC bypasses VPN tunnels, read our guide on [WebRTC IP leaks](/blog/webrtc-ip-leak-explained). The same principle applies to other peer-to-peer protocols that try to establish direct connections.

**VPN detection by services.** Streaming services, financial platforms, and some social networks actively detect and block VPN traffic. If you use split tunneling to access a streaming service through your real IP while using the VPN for other browsing, you avoid the VPN block but sacrifice the privacy benefit for that service. If you do the opposite and route the streaming service through the VPN, you may trigger the block. For a deeper look at how platforms identify VPNs, read our article on [how websites detect and block VPNs](/blog/how-websites-detect-and-block-vpns).

## How to Configure Split Tunneling Safely

If you decide to use split tunneling, treat the configuration as a security task, not a convenience setting.

Start by listing exactly which applications or destinations need to bypass the VPN and why. "Because it is faster" is a valid reason, but write it down. Then list which applications absolutely must never bypass the VPN. Your torrent client, privacy-focused browser, and any tools you use for sensitive research belong on the mandatory list.

Use application-based rules only if your VPN client accurately identifies processes. Some clients struggle with modern applications that use multiple processes, sandboxed workers, or system helper services. When in doubt, test. Open the application, generate some traffic, and check your IP with our [IP lookup tool](/ip-lookup) to confirm whether the traffic is actually routing through the VPN.

Avoid URL-based exclusions unless you trust the VPN client to inspect TLS without introducing vulnerabilities. URL-based splitting requires the client to see the destination domain before the tunnel is established, which can conflict with modern encryption practices like Encrypted Client Hello.

If you need local network access, exclude specific IP ranges rather than applications. This is more reliable because it does not depend on process identification. Most home networks use the 192.168.0.0/16, 10.0.0.0/8, or 172.16.0.0/12 ranges. Exclude these and verify that local devices remain accessible.

Test for leaks after every configuration change. Connect to the VPN, start the applications you think are protected, and visit an IP check page. Then start the applications you think are excluded and check again. If an application shows the wrong IP, your split tunneling rule is not working.

## Split Tunneling Across VPN Protocols

Not all VPN protocols handle split tunneling equally well. OpenVPN, WireGuard, and IKEv2 each implement routing differently, and your operating system also plays a role.

**OpenVPN** is the most flexible. It supports custom route-up and route-pre-down scripts that let advanced users define exactly which traffic goes where. Most commercial VPN clients that offer split tunneling build on OpenVPN's routing capabilities. The downside is that OpenVPN is slower than modern alternatives and more susceptible to blocking.

**WireGuard** is faster and simpler, but that simplicity comes with fewer routing options. Split tunneling in WireGuard-based clients is usually handled by the client application rather than the protocol itself. The application adds routes after the tunnel is established. This works, but it can leave a brief window at startup where traffic flows outside the tunnel. For a comparison of protocol performance and features, read our guide on [VPN protocols explained](/blog/vpn-protocols-explained).

**IKEv2** is common on mobile devices because it handles network transitions well. Split tunneling on IKEv2 is typically configured at the operating system level using per-app VPN profiles on iOS or Android. The operating system decides which apps use the VPN, not the VPN client. This is convenient but less transparent to the user.

On Windows, split tunneling interacts with the Windows Filtering Platform and can conflict with other networking software, including antivirus firewalls and corporate endpoint protection. On macOS, the network extension framework governs split tunneling behavior, and some VPN clients require full disk access to manage routes correctly. On Linux, you can implement split tunneling manually with ip route and iptables or nftables rules, which gives you maximum control at the cost of complexity.

## When to Avoid Split Tunneling Entirely

There are situations where split tunneling is never worth the risk.

If your threat model includes sophisticated adversaries such as state-level surveillance, corporate espionage, or targeted harassment, do not use split tunneling. The correlation risk is too high. A single leaked packet can de-anonymize you. In these cases, a full tunnel combined with a VPN kill switch is the safer baseline. For details on how kill switches prevent exposure during disconnections, read our article on [what is a VPN kill switch](/blog/what-is-a-vpn-kill-switch).

If you are using a VPN to bypass censorship in a restrictive country, split tunneling is dangerous. Censors do not need to decrypt your traffic to punish you. They can flag connections to VPN servers and correlate them with your real IP. Keeping all traffic inside the tunnel makes this correlation harder, though not impossible.

If you cannot verify that your split tunneling rules are working correctly, do not use them. Many users enable split tunneling, assume it works, and never test it. A misconfigured rule that accidentally excludes your browser from the VPN is functionally equivalent to not using a VPN at all.

## What to Do Now

Split tunneling is a powerful feature that trades absolute privacy for flexibility and performance. It makes sense for remote workers who need secure access to corporate resources, for users who want to protect some traffic without breaking local devices, and for anyone who understands exactly which applications are inside and outside the tunnel.

Before enabling it, write down your inclusion and exclusion lists. Test every application after you change the settings. Monitor for DNS leaks, background process leaks, and WebRTC leaks. Revisit the configuration whenever you install new software or change your VPN protocol.

If you are unsure whether a specific application is routing through the VPN, check its public IP with our [IP lookup tool](/ip-lookup). If the address matches your ISP, the application is outside the tunnel. If it matches your VPN server, it is protected. Make that check part of your setup routine every time you change your VPN configuration.
