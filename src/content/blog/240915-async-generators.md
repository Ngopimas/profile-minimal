---
author: Romain C.
pubDatetime: 2024-09-15T14:20:00Z
title: "Async Generators: Streaming Data Without the Memory Pain"
slug: async-generators
featured: false
draft: false
tags: ["javascript", "async", "generators", "streams", "performance"]
description: "How async generators let you process data as it arrives instead of loading everything into memory."
---

Loading a 10,000-item array into memory just to process it one by one is wasteful. Async generators let you yield values as they arrive, keeping memory usage flat regardless of dataset size.

## Paginated APIs

Instead of fetching all pages upfront, yield each user as you get them:

```javascript
async function* fetchAllUsers() {
  let page = 1;
  while (true) {
    const response = await fetch(`/api/users?page=${page}`);
    const data = await response.json();
    if (data.users.length === 0) break;
    yield* data.users;
    page++;
  }
}

for await (const user of fetchAllUsers()) {
  await processUser(user);
}
```

`yield*` delegates to another iterable, so each user is yielded individually even though they arrive in pages.

## File Chunks

Read a large file in 64KB chunks without loading the whole thing:

```javascript
async function* readFileByChunks(file) {
  const reader = file.stream().getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield value;
  }
}
```

## WebSocket Streams

Turn a WebSocket into an async iterable:

```javascript
async function* webSocketStream(url) {
  const ws = new WebSocket(url);
  try {
    while (true) {
      const message = await new Promise((resolve, reject) => {
        ws.onmessage = e => resolve(e.data);
        ws.onerror = e => reject(e);
      });
      yield JSON.parse(message);
    }
  } finally {
    ws.close();
  }
}
```

The `finally` block ensures cleanup even if the consumer breaks early.

## The One Gotcha

Async generators are lazy but not parallel. Each `yield` waits for the previous one to finish. If you're doing independent work per item, use `Promise.all` on a batch instead.

```javascript
// Sequential — slow for independent work
for await (const item of source) {
  await process(item); // Each waits for the previous
}

// Parallel — batch instead
async function* batchProcessor(source, batchSize = 100) {
  let batch = [];
  for await (const item of source) {
    batch.push(item);
    if (batch.length >= batchSize) {
      yield await Promise.all(batch.map(process));
      batch = [];
    }
  }
  if (batch.length) yield await Promise.all(batch.map(process));
}
```

Async generators aren't magic. They're just a clean syntax for "get the next thing when I ask for it." But that simplicity is exactly what makes them useful for streams, pagination, and anything too big to fit in memory at once.
