---
author: Romain C.
pubDatetime: 2024-06-15T09:00:00Z
title: "Event-Driven Systems: What Actually Works"
slug: event-driven-applications
featured: false
draft: false
tags: ["event-driven", "architecture", "cloud", "microservices"]
description: "Event-driven architecture in practice, not theory."
---

Event-driven architecture is sold as the solution to everything. In practice, it's a trade-off: you gain decoupling, but you lose immediate consistency and simple debugging.

## What "Event-Driven" Actually Means

Instead of Service A calling Service B directly, Service A publishes an event (“OrderCreated”) and forgets about it. Service B listens and reacts. They don't know about each other.

This is great until you need to know if Service B actually processed the order. Then you're adding polling, callbacks, or sagas, and the simplicity is gone.

## Event Versioning

Events change. The `OrderCreated` event from last year probably has different fields than today's version. I add a version field and a schema URL:

```javascript
const event = {
  type: "ORDER_CREATED",
  version: "2024-01",
  payload: { orderId: "123", items: [] },
  meta: {
    schemaUrl: "https://schema.company.com/events/order-created/2024-01",
  },
};
```

Consumers check the version and handle what they understand. Don't break old consumers for new fields.

## Handling Failures

Events fail. Networks blip, databases lock, code has bugs. I use a simple retry + dead letter pattern:

```javascript
class OrderEventConsumer {
  async handle(event) {
    try {
      await this.processEvent(event);
    } catch (error) {
      if (this.isRetryable(error)) {
        await this.scheduleRetry(event);
        return;
      }
      await this.moveToDeadLetter(event, error);
    }
  }
}
```

Dead letter queues are your insurance policy. Without them, failed events just disappear.

## When I Don't Use Events

- When the caller needs an immediate response
- When consistency matters more than availability
- When the system is small enough that direct calls are simpler

Event-driven architecture is a tool, not a religion. Use it where decoupling actually helps, not because it's the current trend.
