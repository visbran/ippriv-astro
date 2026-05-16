---
title: 'WebRTC IP Leak: What It Is and How to Protect Your Real IP Address'
description: 'Learn what a WebRTC IP leak is, why your browser can expose your real IP address even when using a VPN, and how to detect and prevent WebRTC leaks.'
publishedAt: 2026-05-16
author: 'Brandon Visca'
heroImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&h=600&fit=crop'
tags: ['WebRTC', 'IP leak', 'VPN', 'privacy', 'browser security']
draft: false
---

## What Is a WebRTC IP Leak?

WebRTC (Web Real-Time Communication) is a browser technology that enables direct peer-to-peer communication — video calls, voice chat, file sharing — without requiring plugins or external software. It is built into every modern browser: Chrome, Firefox, Safari, Edge, and Opera.

The problem? WebRTC uses Interactive Connectivity Establishment (ICE) to discover the best path between peers. Part of this process involves gathering **candidate IP addresses** — including your local (private) IP and your **public IP address** — and sharing them with the remote peer. Even if you are connected through a VPN that hides your real IP from websites, WebRTC can **bypass the VPN tunnel entirely** and expose your actual IP address to the websites you visit.

This is called a **WebRTC IP leak**.

## Why WebRTC Leaks Are a Serious Privacy Threat

Most users rely on VPNs to mask their IP address and maintain anonymity online. A WebRTC leak defeats this protection silently — there is no pop-up, no warning, and no indication in the browser that the leak is occurring. The user appears anonymous to the websites they visit, but their real IP is exposed in the WebRTC handshake.

The implications are significant:

- **VPN users lose anonymity** without knowing it
- **Journalists and activists** under surveillance may be de-anonymized
- **Torrent users** relying on VPN for privacy can have their real IP exposed
- **Bug bounty hunters** testing from behind a VPN may expose their home IP

The vulnerability has been documented since 2015, yet it remains present in browsers by default unless explicitly disabled.

## How Does a WebRTC IP Leak Happen?

Here is the technical sequence:

1. Your browser connects to a VPN. Your external IP is now the VPN server's IP.
2. You visit a website. The website cannot see your real IP — only the VPN's IP.
3. The website includes JavaScript that initiates a WebRTC connection (STUN request).
4. The browser sends a STUN (Session Traversal Utilities for NAT) request to a STUN server to determine the public IP.
5. The response from the STUN server contains your **real public IP address**, which the JavaScript reads and can transmit to the website.

The JavaScript does not need any special permissions. It runs inside a normal web page, and modern browsers allow it by default.

### Example STUN Request Flow

```
Browser → STUN Server (stun:stun.example.com) → Browser
Response contains: {mappedAddress: "203.0.113.42", ...}
```

The `mappedAddress` field in the STUN response is the real public IP. With a few lines of JavaScript, any website can extract it:

```javascript
function getPublicIP() {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com' }] });
  pc.createDataChannel('');
  pc.createOffer().then(offer => pc.setLocalDescription(offer));
  pc.onicecandidate = function(event) {
    if (!event.candidate) return;
    const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(event.candidate.address);
    if (ip) console.log('Real IP:', ip[1]);
  };
}
```

This is not hypothetical — this code pattern is actively used.

## How to Test for a WebRTC IP Leak

The fastest way to check is to use our **[WebRTC Leak Test](/webrtc-leak-test)** tool. It runs entirely in your browser and displays any IP addresses discovered through WebRTC.

Manual test steps:

1. Disconnect from your VPN.
2. Visit a site like `whatismyip.com` and note your IP.
3. Connect to your VPN.
4. Visit `whatismyip.com` again — it should show the VPN IP.
5. Open the browser console (F12) and run the WebRTC detection code above.
6. If the IP from step 5 matches your real IP from step 2, you have a WebRTC leak.

## How to Prevent WebRTC IP Leaks

### For Browser Users

**Firefox:**
1. Type `about:config` in the address bar.
2. Search for `media.peerconnection.enabled`.
3. Set it to `false`. This disables WebRTC entirely.

**Chrome (Desktop):**
WebRTC cannot be fully disabled in Chrome settings, but these options help:

1. Install a WebRTC leak protection extension like **WebRTC Leak Prevent**.
2. Use **uBlock Origin** with the "Prevent WebRTC leak" setting enabled.
3. Alternatively, switch to **Firefox** for more granular control.

** Brave Browser:**
Brave blocks WebRTC leaks by default. You can verify in `Settings → Privacy and Security → WebRTC IP handling policy` set to "Disable non-proxied UDP".

**Safari:**
1. Go to **Preferences → Advanced → Privacy**.
2. Check "Hide IP address from trackers".

### For Website and App Developers

If you are building a real-time application:

- Use **TURN servers** that relay all traffic through a TURN server, ensuring no direct peer IP is exposed.
- Configure your STUN/TURN servers carefully — avoid exposing raw internal addresses.
- Consider disabling WebRTC entirely if peer-to-peer communication is not required.
- Implement WebRTC leak checks in your security testing pipeline.

## Does Disabling WebRTC Break Anything?

For most users: **no.** WebRTC is primarily used for video calling apps (Google Meet, Discord, Facebook Messenger), browser-based file transfers, and live streaming. If you do not use any of these features, you can safely disable it.

If you rely on real-time communication, use a VPN with built-in WebRTC leak protection, or use browser extensions that block only the leak while allowing legitimate WebRTC traffic.

## Quick Checklist: WebRTC Leak Protection

- [ ] Test your current browser for WebRTC leaks
- [ ] Disable WebRTC in Firefox via `about:config`
- [ ] Use uBlock Origin or WebRTC Leak Prevent in Chrome
- [ ] Use Brave (defaults to leak protection)
- [ ] Verify your VPN has a built-in WebRTC leak blocker
- [ ] Test again after making changes

## Conclusion

WebRTC IP leaks are a silent but serious threat to anyone relying on a VPN for anonymity or privacy. The technology was designed for functionality, not for privacy by default. Understanding how the leak occurs and taking simple preventive steps closes a significant attack surface — one that most VPN users do not even know exists.

Run a WebRTC leak test now to see if your current setup is exposing your real IP address.
