---
author: Romain C.
pubDatetime: 2024-02-19T13:00:00Z
title: "Web Workers: When the Main Thread Needs a Break"
slug: optimizing-react-performance
featured: false
draft: false
tags: ["javascript", "web-workers", "performance", "concurrency"]
description: "Moving heavy work off the main thread without overcomplicating your app."
---

The main thread in a browser does everything: parsing HTML, running your JavaScript, handling events, painting pixels. If you dump a heavy computation on it, the UI freezes. Users can't scroll, click, or type. Web Workers are the escape hatch.

A Web Worker is just a JavaScript file that runs in its own thread. It can't touch the DOM, but it can do math, process data, or run algorithms without blocking the UI.

Here's the simplest possible setup. A worker that adds two numbers:

```javascript
// worker.js
self.addEventListener("message", event => {
  const { num1, num2 } = event.data;
  self.postMessage(num1 + num2);
});
```

Main thread:

```javascript
const worker = new Worker("worker.js");

worker.onmessage = event => {
  console.log("Result:", event.data);
};

worker.postMessage({ num1: 5, num2: 10 });
```

That's the whole API. `postMessage` sends data, `onmessage` receives it. The worker lives until you call `worker.terminate()` or the page closes.

## When I Actually Use Them

- **CSV parsing** in a dashboard where users upload files with 100k+ rows
- **Image resizing** before upload
- **Search indexing** for a large local dataset
- **Any calculation that takes longer than ~50ms** and runs in response to user input

The 50ms threshold isn't arbitrary. That's roughly how long you have before a user notices lag. If your function might exceed it, consider a worker.

## The Catch: No DOM, No Shared State

Workers can't access `window`, `document`, or any DOM API. They also don't share memory with the main thread (unless you use `SharedArrayBuffer`, which has its own security headaches). Everything passes through `postMessage`, which clones the data. Send a 50MB object and you'll feel the serialization cost.

For most cases, I keep it simple: send small payloads, get results back, update the UI. If the architecture starts getting complicated, I ask whether the task actually needs to run in the browser or if I should just send it to a server.

## Error Handling

Workers fail silently if you don't listen for errors:

```javascript
worker.onerror = error => {
  console.error("Worker failed:", error.message);
  worker.terminate();
};
```

Always include this. A crashed worker won't recover on its own.
