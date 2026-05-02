---
author: Romain C.
pubDatetime: 2024-10-19T15:00:00Z
title: "Stop Putting Off strict: true"
slug: mastering-strict-tsconfig
featured: false
draft: false
tags: ["typescript", "configuration", "best practices", "software engineering"]
description: "Enable strict TypeScript. Yes, it will break your build. That's the point."
---

Every TypeScript project I inherit has `strict: false` or no strict settings at all. The reason is always the same: "We started without it and now there's too much code to change." That's how you end up with a codebase where half the variables are implicitly `any` and null checks are just vibes.

## What You're Actually Missing

With `strict: false`, TypeScript lets you write this:

```typescript
function add(a, b) {
 return a + b;
}
```

Both parameters are implicitly `any`. The compiler shrugs. You might as well be writing JavaScript with extra steps.

Turn on `strict: true` and the same function becomes:

```typescript
function add(a: number, b: number): number {
 return a + b;
}
```

Yes, it's more typing. But now the compiler catches mismatches at build time instead of letting them hit production.

The settings that matter most:

- `noImplicitAny` - forces explicit types instead of silent `any`
- `strictNullChecks` - makes `null` and `undefined` part of the type system
- `strictFunctionTypes` - catches function signature mismatches

## The Migration Is Less Painful Than You Think

For existing projects, you don't have to flip the switch and fix everything in one day. TypeScript supports incremental adoption:

1. Enable `strict: true` locally
2. Fix one module at a time
3. Use `// @ts-expect-error` (not `@ts-ignore`) for violations you plan to fix
4. Run `tsc --noEmit` in CI so new code can't add more violations

The key is having a rule that new files must pass strict checks. Old code gets cleaned up as you touch it. Within a few months, the problem shrinks dramatically.

## New Projects Have No Excuse

If you're starting a project today and `strict` isn't in your `tsconfig.json`, you're paying for type safety without getting it. Turn it on from day one. The initial friction is a few extra type annotations. The payoff is catching entire categories of bugs before they leave your editor.

I've never met a developer who enabled strict mode and regretted it. I have met plenty who wished they'd done it sooner.
