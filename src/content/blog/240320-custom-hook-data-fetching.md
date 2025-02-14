---
author: Romain C.
pubDatetime: 2024-03-20T13:00:00Z
title: "Creating a Custom Hook for Data Fetching in React"
featured: false
draft: false
tags:
  - react
  - hooks
  - data-fetching
  - javascript
description: "How to create a custom hook for data fetching in React"
---

## Introduction

Data fetching is a common requirement in React applications. Creating a custom hook for data fetching can help you reuse logic and keep your components clean. Let's create a custom hook for data fetching in React.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and React
- React Hooks
- Promises and async/await syntax

## Creating the Custom Hook

### 1. Define the Hook

Create a file named `useFetch.ts` and define the custom hook.

```typescript
// filepath: /src/hooks/useFetch.ts
import { useState, useEffect } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
```

### 2. Using the Custom Hook

Here's an example of how to use the `useFetch` hook in a React component.

```typescript
// filepath: /src/components/App.tsx
import React from "react";
import useFetch from "../hooks/useFetch";

const App = () => {
  const { data, loading, error } = useFetch("https://api.example.com/data");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
```

## Benefits of Custom Hooks

1. **Reusability**: Encapsulate logic that can be reused across multiple components.
2. **Separation of Concerns**: Keep data fetching logic separate from UI logic.
3. **Cleaner Components**: Simplify components by moving data fetching logic to custom hooks.

## Summary

By creating a custom hook for data fetching, you can easily manage data fetching logic in your React applications. This approach not only promotes reusability but also keeps your components clean and maintainable. Happy coding!

## Further Reading

- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
