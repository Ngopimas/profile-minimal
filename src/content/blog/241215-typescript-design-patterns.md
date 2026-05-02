---
author: Romain C.
pubDatetime: 2024-12-15T10:00:00Z
title: "Design Patterns I Actually Use"
slug: typescript-design-patterns
featured: false
draft: false
tags: ["typescript", "design-patterns", "software-engineering"]
description: "A no-nonsense look at the design patterns that show up in real TypeScript codebases."
---

Design pattern articles usually feel like homework. Singleton, Factory, Observer, Strategy, Decorator - each one gets a "What is it?" section, a code block, and a "Pros and Cons" table. Nobody writes code like that in practice. Here's what I actually reach for.

## Factory-ish Things

I rarely implement a full-blown Factory class with a switch statement. What I do use all the time is a simple function that returns different implementations based on a config value or environment variable:

```typescript
function createStorage(type: "local" | "session" | "memory") {
  if (type === "local") return new LocalStorageAdapter();
  if (type === "session") return new SessionStorageAdapter();
  return new InMemoryStorageAdapter();
}
```

That's it. No `Factory` suffix, no UML diagram. Just a function that makes the right thing.

## The Observer Pattern Is Just Events

You don't need a `Subject` class with `addObserver` and `removeObserver` methods. In browser code, the Observer pattern is literally the DOM event system. In Node, it's `EventEmitter`. In React, it's a state management library. The concept is everywhere; the class hierarchy from the Gang of Four book is nowhere.

If you're building something custom, a typed event emitter in TypeScript is usually enough:

```typescript
type Events = {
  userLoggedIn: { id: string };
  dataLoaded: { items: Item[] };
};

class TypedEmitter {
  private listeners: Partial<Record<keyof Events, Function[]>> = {};

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    (this.listeners[event] ??= []).push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach(h => h(payload));
  }
}
```

## Strategy Pattern = Passing Functions

The Strategy pattern sounds fancy until you realize it's just "pass a different function." Instead of:

```typescript
class PaymentContext {
 setStrategy(strategy: PaymentStrategy) { ... }
}
```

I write:

```typescript
function processPayment(amount: number, processor: (n: number) => void) {
  validateAmount(amount);
  processor(amount);
}

processPayment(100, payWithStripe);
processPayment(200, payWithPayPal);
```

No classes, no interfaces, no `Context`. Higher-order functions are the Strategy pattern without the ceremony.

## Decorator = Composition or Higher-Order Functions

I use decorators in TypeScript (`@Injectable`, `@Component`), but I almost never write my own class-based decorators. When I need to layer behavior, I compose functions:

```typescript
const withLogging = (fn: () => void) => () => {
  console.log("start");
  fn();
  console.log("end");
};

const withRetry = (fn: () => Promise<void>) => async () => {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === 2) throw e;
    }
  }
};
```

## What About Singleton?

I don't use Singleton on purpose. Module-level exports in ES modules are already singletons. `export const db = createConnection()` is a singleton. You don't need a `getInstance()` method.

## The Real Pattern

If there's one pattern that matters more than the GoF list, it's "keep related code together and separate what changes from what stays the same." That's just good function boundaries. Everything else is a specific case of that principle.
