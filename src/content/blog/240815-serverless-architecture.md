---
author: Romain C.
pubDatetime: 2024-08-15T10:00:00Z
title: "Serverless: Useful, Expensive, and Cold"
slug: serverless-architecture
featured: false
draft: false
tags: ["serverless", "cloud", "architecture", "aws", "azure", "gcp"]
description: "What serverless actually gives you, what it costs, and when to avoid it."
---

Serverless doesn't mean there are no servers. It means someone else manages them and you only pay for execution time. That sounds great until you get the bill.

## When It Makes Sense

I reach for serverless functions in three situations:

1. **Webhooks and callbacks** - an endpoint that receives a payload, validates it, and queues work. These are usually low-traffic and event-driven. Perfect fit.
2. **Scheduled jobs** - a nightly cleanup script, a weekly report generator. CloudWatch Events or cron triggers handle the scheduling; the function handles the logic.
3. **Glue between services** - processing an S3 upload, transforming a DynamoDB stream, reacting to a Pub/Sub message. Short, stateless transformations.

## When It Doesn't

Long-running processes are a bad match. Most platforms cap execution at 15 minutes. If your job needs an hour, use a container or a VM.

Predictable high traffic is also questionable. A function running 24/7 is often cheaper as a small container. Serverless pricing rewards spiky workloads. Steady-state workloads get punished.

## Cold Starts Are Real

If a function hasn't run recently, the provider tears down the runtime. The next request has to cold-start: initialize the runtime, load your code, run the handler. In JavaScript this is usually under 100ms. In Java or .NET it can be multiple seconds. I've seen Spring Boot Lambda functions take 8 seconds to respond.

Mitigations exist: provisioned concurrency (you pay to keep runtimes warm), smaller dependencies, lighter frameworks. But the simplest fix is choosing the right tool. Don't run a JVM in Lambda if you care about latency.

## Vendor Lock-In Is Overstated

People worry about being trapped in AWS. In practice, a well-written handler is just a function that receives an event and returns a response. The lock-in is in the surrounding services: API Gateway, DynamoDB, S3, Step Functions. Moving those is hard regardless of compute model. The function itself ports easily.

## A Simple Pattern

My default serverless API structure looks like this:

```javascript
exports.handler = async event => {
 try {
 const result = await doWork(event);
 return { statusCode: 200, body: JSON.stringify(result) };
 } catch (error) {
 console.error(error);
 return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
 }
};
```

Wrap the business logic, catch errors, return JSON. Everything else - routing, auth, validation - belongs in middleware or a framework layer. Don't stuff it all into the handler.
