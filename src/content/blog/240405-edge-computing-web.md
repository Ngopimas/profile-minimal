---
author: Romain C.
pubDatetime: 2024-04-05T09:15:00Z
title: "Edge Computing Is Mostly Hype"
slug: edge-computing-web
featured: false
draft: false
tags:
  [
    "edge-computing",
    "performance",
    "web-development",
    "serverless",
    "distributed-systems",
  ]
description: "Edge computing is useful, but it's not the revolution vendors want you to believe."
---

I'll be honest: I'm pretty tired of hearing that edge computing is going to "revolutionize" everything. Every other blog post and conference talk makes it sound like moving a function a few hundred miles closer to the user is the second coming of the internet. It's not.

Don't get me wrong. Edge functions are useful. If you're caching a user session or geolocating a request before it hits your origin, sure, it helps. The latency drop is real—sometimes. But most of the time? You're talking about saving 20–40ms on a request that spends 200ms in your database anyway. The math doesn't always add up.

I tried edge caching for a side project last year. The setup was straightforward enough—Cloudflare Worker, cache match, cache put, the usual. But debugging was a nightmare. Logs are fragmented, local dev doesn't map cleanly to the edge runtime, and you end up shimming Node APIs that don't exist. Half my dependencies wouldn't even compile.

The worst part is the cargo culting. I see teams rewriting perfectly good API routes as edge functions because Vercel put a checkbox in the dashboard, not because they measured a bottleneck. If your user is in Western Europe and your server is in Frankfurt, you probably don't need an edge worker in Amsterdam to shave off five milliseconds.

Here's when edge computing actually makes sense: global personalization, A/B routing, bot detection, and DDoS mitigation. Basically, anything that needs to happen before the request reaches your real infrastructure. If you're doing heavy computation, data hydration, or anything stateful, just run it on a normal server. The edge is a thin layer, not a replacement.

I'm keeping an eye on the space. WASM at the edge could change the equation. But for now, most of the hype is just that—hype. Start with a regular server. Move to the edge when you have numbers that prove you need it, not because a vendor told you it's the future.
