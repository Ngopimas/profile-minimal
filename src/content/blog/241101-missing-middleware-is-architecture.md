---
author: Romain C.
pubDatetime: 2024-11-01T10:00:00Z
title: "The missing middleware is the architecture"
slug: missing-middleware-is-architecture
featured: false
draft: false
tags: ["architecture", "redis", "message-queues", "microservices", "design"]
description: "Architecture is what you don't build. Three times teams removed a layer and the system got faster."
---

I talked to an engineer at a meetup last year. She told me her team had just deleted Redis from their stack. Not replaced it. Not migrated to something lighter. Deleted it.

I asked what broke. She said nothing. Response times dropped 40 percent.

The Redis was solving a problem that did not exist. Postgres was already fast enough. The cache added latency on every cache miss, complexity on every invalidation, and a new failure mode every time the container restarted. They had added it because every architecture diagram has a cache layer. Removing it required admitting the diagram was wrong.

Architecture is what you do not build.

## The addition bias

Teams add layers for three reasons.

First, perceived sophistication. A stack with a message queue, a cache, a search index, and an event bus looks more impressive on a diagram. The interview answer "we used Kafka" sounds better than "we used PostgreSQL notifications". The second system is simpler. The first one gets more handshakes at the conference.

Second, people want to work with specific tools. A team that wants to use Redis will find a reason to use Redis. The reason might be legitimate. It might also be "we might need caching eventually" applied to a system with 200 users.

Third, fear of constraint. A monolith feels limiting. Microservices feel like freedom. The freedom is real but so is the complexity. Every network call is a failure mode. Every service boundary is a lie waiting to be exposed at 3am.

I have been on both sides of this. I have added layers that should not exist. I have removed layers that people thought were load-bearing. The removal is always scarier and almost always better.

## Three cases where the missing layer was the insight

**Case A: A cache that slowed everything down.**

A fintech startup had a Redis cache in front of their Postgres database. The cache hit rate was 40 percent. On a cache miss, the request went to Redis (miss), then to Postgres (hit), then back to Redis (populate), then back to the client. A cache miss was slower than no cache at all.

They removed Redis. Average response time dropped from 120ms to 80ms. Postgres was already well-indexed. The dataset was small enough to fit in memory. The cache was solving a problem from 2019 when the dataset was larger and the queries were less optimized.

The fix was not a better cache strategy. The fix was deleting the cache.

**Case B: An event bus that added coupling.**

An e-commerce team used an event bus to decouple their order service from their inventory service. In theory, this meant each service could evolve independently. In practice, every change to the order service required a corresponding change to the event schema, which required a coordinated deployment with the inventory service.

They replaced the event bus with synchronous HTTP calls. The coupling became explicit instead of hidden. Deployment coordination was still needed, but now it was obvious. The "decoupling" had been an illusion maintained by asynchronous confusion.

**Case C: A microservice that should have been a function.**

A team had a microservice for generating PDF invoices. One endpoint. No independent scaling needs. No separate data store. The service existed because "we are migrating to microservices" and somebody had to go first.

They inlined the PDF generation into the orders service. One less service to deploy, monitor, and debug. One less network call between services. The microservice had been solving an organizational problem (we need to prove we can do microservices) not a technical one.

## How to identify removal candidates

I ask three questions before adding any layer.

**What would break if I deleted this tomorrow?** If the answer is "nothing obvious", the layer might be cargo cult infrastructure. Add a load test. If the system handles the traffic without the layer, remove it.

**Can I explain why this layer exists in one sentence?** If the explanation is vague ("for scalability" or "best practice" or "in case we need it later"), the layer does not have a job. Every layer should have a specific, current reason for existing.

**What does this layer cost when it works, not just when it fails?** A cache that works costs: invalidation logic, memory, deployment complexity, monitoring. A message queue that works costs: schema management, operational overhead, debugging distributed state. If the cost of working is higher than the cost of not having it, remove the thing.

## When removal is wrong

Not every layer should be removed.

Some layers provide isolation you genuinely need. A database connection pool is not optional. A reverse proxy is not optional. A message queue for genuinely asynchronous work (email, reports, batch processing) is not optional.

Some layers exist because of compliance. Audit logs, encryption at rest, access controls. You cannot remove these because the alternative is a regulatory problem.

The test is simple: can you explain what breaks if you delete it? If the answer is specific and the breakage is real, keep it. If the answer is hand-waving, you have a candidate.

## The economics of removal

Removing a layer removes more than the layer. It removes the monitoring for that layer. It removes the deployment scripts. It removes the documentation. It removes the failure modes that live in the gap between layers. It removes the cognitive load of understanding how data flows through six things instead of five.

A system with fewer layers is not "simpler" in some abstract sense. It is simpler in the way that matters: there is less to understand, less to break, and less to debug at 3am.

The best architecture is not the one with the most layers. It is the one where every remaining layer has a job it cannot do without.
