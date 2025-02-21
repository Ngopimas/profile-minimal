---
author: Romain C.
pubDatetime: 2024-05-20T15:30:00Z
title: "React Debugging with VSCode and Chrome DevTools"
slug: debugging-react-vscode
featured: false
draft: false
tags: ["react", "debugging", "vscode", "chrome-devtools"]
description: "Practical examples to debug React applications using VSCode and Chrome DevTools."
---

As React developers, we often face various debugging challenges. Let's explore effective techniques to debug React applications using VSCode and Chrome DevTools, with practical examples.

## Setting Up A Debugging Environment

Before diving into debugging techniques, let's configure a robust development environment.

### VSCode Configuration

A minimal yet powerful launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "React Debug",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173", // Vite's default port
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

## Real-World Debugging Scenarios

### 1. Unnecessary Re-renders

A common issue is unnecessary re-renders. Here’s how to debug them:

```jsx
import { useEffect } from 'react';

function ProductCard({ product, onSave }) {
  useEffect(() => {
    // Set a breakpoint here to track re-renders
    console.log('[ProductCard] Rendered with:', {
      productId: product.id,
      savedCallback: onSave.toString()
    });
  });

  return (/* component JSX */);
}
```

### 2. Unexpected State Updates

When state updates don't behave as expected, use this debugging pattern:

```jsx
function TaskList() {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback(newTask => {
    // Debug point 1: Log pre-update state
    console.debug("Current tasks:", tasks);

    setTasks(current => {
      // Debug point 2: Log what's being added
      console.debug("Adding task:", newTask);
      return [...current, newTask];
    });
  }, []);
}
```

## Chrome DevTools Techniques

### Custom Console Formatters

A formatter to make React component debugging more visual:

```javascript
// In your dev setup file
if (process.env.NODE_ENV === "development") {
  window.devtoolsFormatters = [
    {
      header: function (obj) {
        if (obj?.type?.name) {
          return ["div", {}, `📦 ${obj.type.name} Component`];
        }
        return null;
      },
      hasBody: () => true,
    },
  ];
}
```

### Component Performance Profiling

When hunting performance issues, use this approach:

```jsx
import { Profiler } from "react";

function ProfilingWrapper({ children }) {
  const onRender = (id, phase, actualDuration) => {
    if (actualDuration > 16) {
      // Longer than one frame
      console.warn(`Slow render in ${id}: ${actualDuration}ms`);
    }
  };

  return <Profiler onRender={onRender}>{children}</Profiler>;
}
```

## Advanced Debugging Patterns

### 1. State Time-Travel Debugging

Pattern for complex state debugging:

```jsx
function useStateWithHistory(initialState) {
  const [state, setState] = useState(initialState);
  const history = useRef([initialState]);

  const setStateWithHistory = useCallback(newState => {
    history.current.push(newState);
    setState(newState);
  }, []);

  return [state, setStateWithHistory, history.current];
}
```

### 2. Network Request Debugging

For API calls, use this debug interceptor:

```typescript
import axios from "axios";

const api = axios.create();
api.interceptors.request.use(config => {
  console.debug(`🌐 ${config.method?.toUpperCase()} ${config.url}`, {
    payload: config.data,
    headers: config.headers,
  });
  return config;
});
```

## Practical Debugging Tips

1. **Use Custom Hooks for Debug Logging**

```jsx
function useDebugEffect(componentName, deps) {
  useEffect(() => {
    console.log(`[${componentName}] Dependencies changed:`, deps);
  }, deps);
}
```

2. **Conditional Breakpoints for Complex Flows**

```jsx
function UserList({ users }) {
  return users.map(user => {
    // Add conditional breakpoint: user.status === 'error'
    return <UserCard key={user.id} user={user} />;
  });
}
```

## Common Pitfalls and Solutions

Here are some issues encountered and their solutions:

1. **Stale Closures in Events**

   - Use `useEvent` hook (coming to React) or proper dependency management
   - Implement ref-based solutions for current values

2. **Context Performance Issues**
   - Split contexts by update frequency
   - Use context selectors to prevent unnecessary rerenders

## Conclusion

Debugging React applications involves various tools and techniques. The key is to develop a systematic approach and know which tool to use for different scenarios. Remember:

- Start with the simplest debugging method first
- Build debugging utilities that you can reuse
- Learn to read React component traces effectively
- Keep your debugging tools updated

What debugging techniques do you use in your React projects? Share your experiences and let's learn from each other!

## Further Reading

- [React DevTools Documentation](https://react.dev/learn/react-developer-tools) - Official guide to using React Developer Tools
- [VSCode Debugging Guide](https://code.visualstudio.com/docs/editor/debugging) - Complete guide to debugging in VSCode
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/) - In-depth guide to Chrome DevTools features
- [React Performance Optimization](https://react.dev/learn/render-and-commit) - Understanding React's rendering process
- [JavaScript Debugging Tips](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors) - MDN's guide to common JavaScript errors and debugging
