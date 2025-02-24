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

## Introduction

In the world of API development, ensuring that multiple identical requests have the same effect as a single request is crucial. This concept, known as idempotency, is particularly important in scenarios where network issues or client retries might lead to duplicate requests. Let's explore how to build an idempotent API using TypeScript, Express, and Redis.

## What is Idempotency?

Idempotency means that an operation can be performed multiple times without changing the result beyond the initial application. In the context of APIs, it ensures that making the same request multiple times will not have additional side effects.

### Why is Idempotency Important?

- **Prevents Duplicate Operations**: Ensures that operations like order creation or payment processing are not executed multiple times.
- **Improves Reliability**: Helps in building reliable systems that can handle retries gracefully.
- **Enhances User Experience**: Users can safely retry operations without worrying about unintended consequences.

## Project Overview

This project demonstrates how to implement an idempotent API using TypeScript, Express, and Redis. We'll cover the following key aspects:

1. **Idempotency Key**: Clients generate a unique key for each request and send it in the request header.
2. **Storage Mechanism**: Use Redis to store and check idempotency keys.
3. **Check and Process**: On receiving a request, check if the key exists. If it does, return the previous response; otherwise, process the request and store the key.

## Product Context

Imagine you are building an e-commerce platform where users can place orders for products. In such a scenario, ensuring that an order is created only once, even if the user accidentally submits the request multiple times, is critical. Idempotency helps in preventing duplicate orders, ensuring that users are charged correctly and inventory is managed accurately.

### Use Cases

- **Order Processing**: Prevent duplicate orders when users accidentally click the "Place Order" button multiple times.
- **Payment Transactions**: Ensure that payment is processed only once, even if the payment request is retried due to network issues.
- **Account Creation**: Avoid creating multiple user accounts when the registration form is submitted multiple times.

## Setting Up the Project

### 1. Clone the Repository

```sh
git clone https://github.com/ngopimas/idempotent-api.git
cd idempotent-api
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create a `.env` File

```sh
REDIS_HOST=localhost
REDIS_PORT=6379
```

Make sure you have Redis installed and running locally.

### 4. Start the Server (Development)

```sh
npm run dev
```

The server will run on **http://localhost:3000**.

## Implementing Idempotency

### Idempotency Middleware

We'll create middleware to handle idempotency keys. This middleware will check if the key exists in Redis and either return the stored response or process the request.

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

### Using the Middleware

Apply the middleware to your routes to ensure idempotency.

```typescript
// src/routes/orderRoutes.ts
import express from "express";
import { createOrder } from "../controllers/orderController";
import { idempotencyMiddleware } from "../middleware/idempotency";

const router = express.Router();

router.post("/orders", idempotencyMiddleware, createOrder);

export default router;
```

### Order Controller

Handle the order creation logic and store the response in `res.locals`.

```typescript
// src/controllers/orderController.ts
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  const { product, quantity } = req.body;

  // Simulate order creation logic
  const order = {
    id: new Date().getTime().toString(),
    product,
    quantity,
  };

  res.locals.response = { message: "Order created", order };
  res.status(200).json(res.locals.response);
};
```

## Testing Idempotency

To ensure that our idempotency implementation works correctly, we need to write tests that simulate multiple identical requests and verify that the responses are consistent.

### Writing Tests

```typescript
// tests/idempotency.test.ts
import request from "supertest";
import app from "../src/app";
import { redisClient } from "../src/services/redisService";

describe("Idempotency Middleware", () => {
  beforeAll(async () => {
    await redisClient.flushall();
  });

  it("should return the same response for multiple requests with the same idempotency key", async () => {
    const idempotencyKey = "unique-key-123";
    const orderData = { product: "Laptop", quantity: 1 };

    const firstResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    const secondResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    expect(secondResponse.body).toEqual(firstResponse.body);
  });

  it("should return an error if the idempotency key is missing", async () => {
    const orderData = { product: "Laptop", quantity: 1 };

    const response = await request(app).post("/orders").send(orderData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing Idempotency-Key header" });
  });
});
```

## Handling Edge Cases

Consider edge cases such as expired idempotency keys, different payloads with the same key, and concurrent requests.

### Expired Idempotency Keys

Ensure that idempotency keys have an expiration time to prevent indefinite storage.

```typescript
// src/middleware/idempotency.ts
// ...existing code...
await redisClient.set(
  idempotencyKey,
  JSON.stringify(res.locals.response),
  "EX",
  3600 // 1 hour expiration
);
// ...existing code...
```

### Different Payloads with the Same Key

Return an error if the payload differs for the same idempotency key.

```typescript
// src/middleware/idempotency.ts
// ...existing code...
const cachedPayload = await redisClient.get(`${idempotencyKey}-payload`);

if (cachedPayload && cachedPayload !== JSON.stringify(req.body)) {
  return res
    .status(400)
    .json({ error: "Payload mismatch for Idempotency-Key" });
}

await redisClient.set(
  `${idempotencyKey}-payload`,
  JSON.stringify(req.body),
  "EX",
  3600
);
// ...existing code...
```

### Concurrent Requests

Handle concurrent requests by using Redis transactions or Lua scripts to ensure atomic operations.

## Challenges and Solutions

### Challenge: High Traffic

Handling high traffic can be challenging, especially when multiple requests with the same idempotency key are received simultaneously. Use Redis transactions or Lua scripts to ensure atomic operations and prevent race conditions.

### Challenge: Key Expiration

Expired idempotency keys can lead to duplicate processing if the same key is reused. Ensure that keys have a reasonable expiration time and handle expired keys gracefully.

### Challenge: Payload Mismatch

Different payloads with the same idempotency key can cause inconsistencies. Implement checks to compare payloads and return errors if they differ.

## Conclusion

By following these steps, you can ensure that your API operations are idempotent, providing a more robust and user-friendly experience. This project illustrates how to implement idempotency using Redis as a storage mechanism, handle idempotency keys in API requests, and follow best practices for ensuring exactly-once semantics in API operations.
