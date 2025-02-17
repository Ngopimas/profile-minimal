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

LocalStorage is a simple and convenient way to store data in the browser. However, as applications grow, you might need to handle these operations asynchronously, especially if you plan to replace localStorage with other storage solutions with HTTP API calls in the future. Let's explore how to create async functions for localStorage and a custom React hook to manage these operations.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and TypeScript
- React and React Hooks
- Promises and async/await syntax

## Why Async LocalStorage?

While localStorage operations are synchronous by nature, making them asynchronous can help in scenarios where you might want to replace localStorage with an asynchronous storage solution without changing the rest of your codebase. This approach also keeps your codebase future-proof and more flexible.

## Benefits of Async LocalStorage

1. **Future-Proofing**: Easily switch to other storage solutions without changing the core logic.
2. **Improved Performance**: Non-blocking operations can lead to a smoother user experience.
3. **Better Error Handling**: Handle errors more gracefully with async/await syntax.

## Potential Use Cases

- **Quiz Applications**: Store user's selected answers asynchronously.
- **User Preferences**: Store multiple choice settings like theme selection.
- **Survey Forms**: Save user responses with the ability to resume later.
- **Offline Support**: Cache user selections for later synchronization.

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

## Error Handling in Async Functions

To make your async localStorage functions more robust, you can add error handling using try-catch blocks. This will help you gracefully handle any errors that might occur during the read/write operations.

```typescript
// filepath: /src/utils/asyncLocalStorage.ts
export const asyncSetItem = async (
  key: string,
  value: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, value);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const asyncGetItem = async (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {
      const value = localStorage.getItem(key);
      resolve(value);
    } catch (error) {
      reject(error);
    }
  });
};
```

## Creating a Custom React Hook

Next, we'll create a custom React hook that uses these async functions to manage localStorage. This hook will help us store and retrieve a selected value from a set of options.

```typescript
// filepath: /src/hooks/useAsyncLocalStorage.ts
import { useState, useEffect } from "react";
import { asyncSetItem, asyncGetItem } from "../utils/asyncLocalStorage";

/**
 * Custom hook to manage async localStorage operations.
 * @param key - The key under which the value is stored.
 * @param initialValue - The initial value to use if the key does not exist.
 * @returns A tuple containing the stored value, setter function, and loading state.
 */
const useAsyncLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchValue = async () => {
      setLoading(true);
      try {
        const item = await asyncGetItem(key);
        if (item !== null) {
          setStoredValue(item);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchValue();
  }, [key]);

  const setValue = async (value: string) => {
    setLoading(true);
    try {
      await asyncSetItem(key, value);
      setStoredValue(value);
    } finally {
      setLoading(false);
    }
  };

  return [storedValue, setValue, loading] as const;
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
  const [selectedValue, setSelectedValue, loading] = useAsyncLocalStorage("selectedValue", "A");

  const handleClick = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Selected Value: {selectedValue}</h1>
          <div>
            <button onClick={() => handleClick("A")}>A</button>
            <button onClick={() => handleClick("B")}>B</button>
            <button onClick={() => handleClick("C")}>C</button>
            <button onClick={() => handleClick("D")}>D</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
```

## Testing the Custom Hook

To ensure our custom hook works correctly, we can write tests using a testing library like React Testing Library and Jest.

```typescript
// filepath: /src/hooks/useAsyncLocalStorage.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import useAsyncLocalStorage from "./useAsyncLocalStorage";

describe("useAsyncLocalStorage", () => {
  it("should retrieve and update the value in localStorage", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncLocalStorage("testKey", "initialValue")
    );

    expect(result.current[0]).toBe("initialValue");

    act(() => {
      result.current[1]("newValue");
    });

    await waitForNextUpdate();

    expect(result.current[0]).toBe("newValue");
  });
});
```

## Summary

By creating async functions for localStorage and a custom React hook, you can easily manage localStorage operations asynchronously. This approach not only prepares your code for future enhancements but also keeps your components clean and easy to maintain.

## Further Reading

- [MDN Web Docs: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Promises in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
