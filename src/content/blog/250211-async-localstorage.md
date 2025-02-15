---
author: Romain C.
pubDatetime: 2025-02-11T15:30:00Z
title: "Async LocalStorage in TypeScript"
slug: async-localstorage
featured: false
draft: false
tags: ["typescript", "localStorage", "async", "react", "hooks"]
description: "How to handle localStorage asynchronously in TypeScript and React"
---

## Introduction

LocalStorage is a simple and convenient way to store data in the browser. However, as applications grow, you might need to handle this operations asynchronously, especially if you plan to replace localStorage with other storage solutions with HTTP API calls in the future. Let's explore how to create async functions for localStorage and a custom React hook to manage these operations.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and TypeScript
- React and React Hooks
- Promises and async/await syntax

## Why Async LocalStorage?

While localStorage operations are synchronous by nature, making them asynchronous can help in scenarios where you might want to replace localStorage with an asynchronous storage solution without changing the rest of your codebase. This approach also keeps your codebase future-proof and more flexible.

## Creating Async LocalStorage Functions

First, let's create two async functions to read and write to localStorage. These functions will use Promises to simulate asynchronous behavior.

```typescript
// filepath: /src/utils/asyncLocalStorage.ts
/**
 * Asynchronously sets an item in localStorage.
 * @param key - The key under which the value is stored.
 * @param value - The value to store.
 */
export const asyncSetItem = async (
  key: string,
  value: string
): Promise<void> => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

/**
 * Asynchronously gets an item from localStorage.
 * @param key - The key of the item to retrieve.
 * @returns The value associated with the key, or null if the key does not exist.
 */
export const asyncGetItem = async (key: string): Promise<string | null> => {
  return new Promise(resolve => {
    const value = localStorage.getItem(key);
    resolve(value);
  });
};
```

## Creating a Custom React Hook

Next, we'll create a custom React hook that uses these async functions to manage localStorage. This hook will provide a way to read and write data asynchronously within a React component.

```typescript
// filepath: /src/hooks/useAsyncLocalStorage.ts
import { useState, useEffect } from "react";
import { asyncSetItem, asyncGetItem } from "../utils/asyncLocalStorage";

/**
 * Custom hook to manage async localStorage operations.
 * @param key - The key under which the value is stored.
 * @param initialValue - The initial value to use if the key does not exist.
 * @returns A tuple containing the stored value and a function to update it.
 */
const useAsyncLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(initialValue);

  useEffect(() => {
    const fetchValue = async () => {
      const item = await asyncGetItem(key);
      if (item !== null) {
        setStoredValue(item);
      }
    };

    fetchValue();
  }, [key]);

  const setValue = async (value: string) => {
    await asyncSetItem(key, value);
    setStoredValue(value);
  };

  return [storedValue, setValue] as const;
};

export default useAsyncLocalStorage;
```

## Using the Custom Hook in a React Component

Here's an example of how to use the `useAsyncLocalStorage` hook in a React component:

```typescript
// filepath: /src/components/App.tsx
import React from "react";
import useAsyncLocalStorage from "../hooks/useAsyncLocalStorage";

const App = () => {
  const [name, setName] = useAsyncLocalStorage("name", "Guest");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <input type="text" value={name} onChange={handleChange} />
    </div>
  );
};

export default App;
```

## Benefits of Async LocalStorage

1. **Future-Proofing**: Easily switch to other storage solutions without changing the core logic.
2. **Improved Performance**: Non-blocking operations can lead to a smoother user experience.
3. **Better Error Handling**: Handle errors more gracefully with async/await syntax.

## Potential Use Cases

- **User Preferences**: Store and retrieve user settings asynchronously.
- **Session Management**: Manage session data without blocking the main thread.
- **Offline Support**: Sync data with a remote server when the user is back online.

## Summary

By creating async functions for localStorage and a custom React hook, you can easily manage localStorage operations asynchronously. This approach not only prepares your code for future enhancements but also keeps your components clean and easy to maintain.

## Further Reading

- [MDN Web Docs: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Promises in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
