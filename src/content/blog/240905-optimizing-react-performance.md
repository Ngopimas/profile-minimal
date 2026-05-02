---
author: Romain C.
pubDatetime: 2024-09-05T18:22:00Z
title: "React Performance: Memoization Is Not Free"
slug: optimizing-react-performance
featured: false
draft: false
tags: ["react", "performance", "optimization", "javascript"]
description: "When React.memo, useMemo, and useCallback help - and when they make things worse."
---

The first thing most developers do when a React app feels slow is wrap everything in `React.memo` and `useMemo`. That's usually the wrong move.

## The Real Bottleneck Is Usually Elsewhere

Before you memoize anything, check if you're:

- Rendering a massive list without virtualization
- Running heavy computations during render
- Including libraries you don't need in the bundle
- Triggering re-renders by putting objects in context that change reference every render

`React.memo` won't fix any of that. It only helps when a component receives the same props but re-renders because its parent did. If your props are changing anyway, memoization is pure overhead.

## When Memoization Actually Helps

`useMemo` is worth it when you have an expensive computation:

```javascript
const sortedItems = useMemo(() => {
 return [...items].sort((a, b) => a.price - b.price);
}, [items]);
```

Note the spread `[...items]`. If you mutate the array in place with `.sort()`, `useMemo` won't protect you because the reference doesn't change.

`useCallback` matters when you pass a function to a memoized child:

```javascript
const handleClick = useCallback(() => {
 doSomething(id);
}, [id]);

// MemoizedButton won't re-render unless id changes
<MemoizedButton onClick={handleClick} />
```

If `MemoizedButton` isn't memoized, `useCallback` does nothing.

## The Profiler Is Your Friend

Don't guess. Open React DevTools Profiler, record a session, and look at what's actually slow. The flamegraph tells you which components are expensive and why. I've seen teams spend days optimizing memoization when the real problem was a single component making a synchronous API call on every keystroke.

## Lazy Loading

`React.lazy` + `Suspense` is the one technique that's almost always a win for initial page load:

```javascript
const HeavyChart = React.lazy(() => import("./HeavyChart"));

function Dashboard() {
 return (
 <Suspense fallback={<Spinner />}>
 <HeavyChart />
 </Suspense>
 );
}
```

Split your routes, not your buttons. Micro-optimizing component-level lazy loading is usually not worth the complexity.

## Bottom Line

Measure first. Memoization adds complexity and can hurt performance if misapplied. The default in React is to re-render - and most of the time, that's fine.
