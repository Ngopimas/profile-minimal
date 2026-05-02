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

localStorage is synchronous. Everyone knows this. But I keep seeing React hooks that read from it directly in render, then wonder why there's a tiny hitch on first paint. If you're going to treat storage like a side effect, you might as well make it async and keep your UI non-blocking.

Here's the wrapper I copy-paste into projects. It's nothing clever - just Promise wrappers so the API shape matches async storage libraries:

```typescript
export const asyncSetItem = async (key: string, value: string): Promise<void> => {
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
 resolve(localStorage.getItem(key));
 } catch (error) {
 reject(error);
 }
 });
};
```

The real payoff is the hook. I want something that reads on mount, handles the initial flash of default state, and gives me a setter that feels like `useState`:

```typescript
import { useState, useEffect } from "react";
import { asyncSetItem, asyncGetItem } from "../utils/asyncLocalStorage";

const useAsyncLocalStorage = (key: string, initialValue: string) => {
 const [storedValue, setStoredValue] = useState<string>(initialValue);
 const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
 const fetchValue = async () => {
 setLoading(true);
 try {
 const item = await asyncGetItem(key);
 if (item !== null) setStoredValue(item);
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
```

Usage is straightforward:

```typescript
const App = () => {
 const [selected, setSelected, loading] = useAsyncLocalStorage("choice", "A");

 if (loading) return <p>Loading...</p>;

 return (
 <div>
 <h1>Selected: {selected}</h1>
 {["A", "B", "C", "D"].map((opt) => (
 <button key={opt} onClick={() => setSelected(opt)}>{opt}</button>
 ))}
 </div>
 );
};
```

Does this actually improve performance? Not in any way you'd measure. localStorage is still blocking under the hood. But the API consistency matters. When the PM inevitably says "actually we need to sync this to the cloud," you're already returning Promises. Swap the implementation, keep the hook. That's the win.
