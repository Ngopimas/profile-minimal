---
author: Romain C.
pubDatetime: 2024-03-20T13:00:00Z
title: "Creating a Custom Hook for Data Fetching in React"
featured: false
draft: false
tags: ["react", "hooks", "data-fetching", "javascript"]
description: "A simple useFetch hook I copy-paste into most projects"
---

I write some version of this hook in almost every React project. It is not clever. It just wraps fetch in useEffect and exposes loading, error, and data states. That is usually all you need.

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

Using it in a component:

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

This pattern keeps data fetching out of your components. The component only cares about rendering. The hook only cares about fetching. Separation of concerns, but without the ceremony of a full state management library.

For more complex cases, I usually reach for React Query or SWR. They handle caching, deduplication, background refetching, and all the edge cases that this simple hook ignores. But for a quick prototype or a small project, the simple hook above is enough.
