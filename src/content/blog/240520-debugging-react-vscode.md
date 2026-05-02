---
author: Romain C.
pubDatetime: 2024-05-20T15:30:00Z
title: "React Debugging with VSCode and Chrome DevTools"
slug: debugging-react-vscode
featured: false
draft: false
tags: ["react", "debugging", "vscode", "chrome-devtools"]
description: "The debugging setup I use for React apps."
---

I spent years adding `console.log` everywhere before I bothered setting up a proper debugging workflow. Here's what I use now.

## VSCode Launch Config

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "React Debug",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

Hit F5, set breakpoints directly in your JSX, inspect state without logging. It just works with Vite.

## Finding Unnecessary Re-renders

Add a debug effect to see what's changing:

```jsx
function ProductCard({ product, onSave }) {
  useEffect(() => {
    console.log('[ProductCard] Rendered with:', {
      productId: product.id,
      savedCallback: onSave.toString()
    });
  });
  // ...
}
```

If `onSave` changes every render, you've got a stale closure or missing `useCallback`.

## React Profiler

Wrap components in `Profiler` to catch slow renders:

```jsx
import { Profiler } from "react";

<Profiler onRender={(id, phase, actualDuration) => {
  if (actualDuration > 16) {
    console.warn(`Slow render in ${id}: ${actualDuration}ms`);
  }
}}>
  <YourComponent />
</Profiler>
```

Anything over 16ms drops a frame. Profile in production builds too—dev mode is 2-3x slower.

## Network Debugging

For API calls, I add a simple Axios interceptor in dev:

```typescript
api.interceptors.request.use(config => {
  console.debug(`${config.method?.toUpperCase()} ${config.url}`, {
    payload: config.data,
  });
  return config;
});
```

## The One Rule

Don't debug in the browser console if you can avoid it. The debugger shows you the exact line, the call stack, and the closure scope. `console.log` only shows what you thought to print.
