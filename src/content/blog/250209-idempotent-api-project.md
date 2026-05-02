---
author: Romain C.
pubDatetime: 2025-02-09T12:00:00Z
title: "Building an Idempotent API with TypeScript, Express, and Redis"
slug: idempotent-api-project
featured: false
draft: false
tags: ["typescript", "express", "redis", "api", "idempotency"]
description: "A comprehensive guide to implementing idempotent APIs using TypeScript, Express, and Redis"
---

Double-charging a customer because they mashed the "Pay" button is the kind of bug that keeps you up at night. Idempotency isn't a nice-to-have for payment or order endpoints; it's basic hygiene. If a client retries a request, the server should recognize it and return the same response, not create another record.

I put together a small demo with Express and Redis. The idea is simple: the client generates a unique key and sends it in an `Idempotency-Key` header. The server checks Redis before doing any real work.

The middleware looks like this:

```typescript
// src/middleware/idempotency.ts
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../services/redisService";

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Missing Idempotency-Key header" });
  }

  const cachedResponse = await redisClient.get(idempotencyKey);
  if (cachedResponse) {
    return res.status(200).json(JSON.parse(cachedResponse));
  }

  res.on("finish", async () => {
    if (res.statusCode === 200) {
      await redisClient.set(
        idempotencyKey,
        JSON.stringify(res.locals.response),
        "EX",
        3600
      );
    }
  });

  next();
};
```

Hook it to your route:

```typescript
router.post("/orders", idempotencyMiddleware, createOrder);
```

The controller stores the response in `res.locals` so the middleware can cache it after the fact:

```typescript
export const createOrder = async (req: Request, res: Response) => {
  const { product, quantity } = req.body;
  const order = {
    id: new Date().getTime().toString(),
    product,
    quantity,
  };

  res.locals.response = { message: "Order created", order };
  res.status(200).json(res.locals.response);
};
```

I added a payload check too. If someone reuses the same idempotency key with different body data, that's probably a bug in the client, so I return a 400:

```typescript
const cachedPayload = await redisClient.get(`${idempotencyKey}-payload`);
if (cachedPayload && cachedPayload !== JSON.stringify(req.body)) {
  return res.status(400).json({ error: "Payload mismatch for Idempotency-Key" });
}
await redisClient.set(`${idempotencyKey}-payload`, JSON.stringify(req.body), "EX", 3600);
```

Tests with supertest are straightforward. Fire two identical requests, assert the same body back:

```typescript
describe("Idempotency Middleware", () => {
  beforeAll(async () => {
    await redisClient.flushall();
  });

  it("should return the same response for duplicate keys", async () => {
    const key = "unique-key-123";
    const orderData = { product: "Laptop", quantity: 1 };

    const first = await request(app)
      .post("/orders")
      .set("Idempotency-Key", key)
      .send(orderData);

    const second = await request(app)
      .post("/orders")
      .set("Idempotency-Key", key)
      .send(orderData);

    expect(second.body).toEqual(first.body);
  });
});
```

Redis handles the expiration, so keys don't pile up forever. For real production traffic I'd probably add a Redis Lua script or a distributed lock to deal with race conditions on truly simultaneous duplicate requests, but that's a problem most projects never hit. Start simple. Add complexity when you have proof you need it.
