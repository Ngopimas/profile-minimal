---
author: Romain C.
pubDatetime: 2025-03-10T17:45:00Z
title: "Cache Me If You Can"
slug: caching-strategies
featured: false
draft: false
tags: ["performance", "caching", "web development", "backend", "frontend"]
description: "The caching strategies I actually use, and the ones I avoid."
---

Caching is the fastest way to make a slow app feel fast. It's also the fastest way to introduce subtle bugs that only show up in production at 2am. I've been on both sides of that.

## Cache-Aside (Lazy Loading)

This is the pattern I reach for 90% of the time. Check the cache, return if found, fetch from the database, store in cache, return. Simple, predictable, easy to reason about.

```javascript
async function getUserProfile(userId) {
  const cached = await redisClient.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const profile = await database.query("SELECT * FROM users WHERE id = ?", [userId]);
  await redisClient.set(`user:${userId}`, JSON.stringify(profile), "EX", 1800);
  return profile;
}
```

The downside? If the cache goes down, every request hits the database at full volume. I've seen Redis outages turn a healthy API into a smoldering crater because the fallback path wasn't tested.

## Write-Through

Update the cache and the database at the same time. More consistent, but writes are slower because you're doing two operations. I use this for small, frequently-read records like user preferences or feature flags.

## Write-Behind (Write-Back)

Write to cache immediately, flush to database later in batches. Fast writes, but you can lose data if the cache dies before the flush. I only use this for analytics counters and metrics where losing a few events is acceptable.

## TTL: Your Safety Net

Every cached key should have a time-to-live. Even if you have explicit invalidation logic. I've debugged too many issues where "we clear the cache on update" turned out to miss an edge case. TTL is your insurance policy.

```javascript
await redisClient.set(`weather:${cityId}`, JSON.stringify(forecast), "EX", 1800);
```

## What I Don't Do

- Cache everything. Some data is cheaper to compute than to serialize, store, and deserialize.
- Share cache keys across services without a namespace. `user:123` means different things to different teams.
- Assume cache invalidation is solved. It's not. It's just managed poorly in different ways.

## The Real Rule

Cache data that is expensive to compute and slow to change. Invalidate aggressively when it does change. Measure cache hit rates in production. A 10% hit rate means your cache is useless; a 95% hit rate means you might be caching too aggressively and serving stale data.
