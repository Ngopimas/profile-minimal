---
author: Romain C.
pubDatetime: 2023-04-17T13:00:00Z
title: "CI/CD with GitHub Actions"
slug: ci-cd-github-actions
featured: false
draft: false
tags: ["github", "ci-cd", "devops", "automation"]
description: "A minimal GitHub Actions setup that actually works."
---

I used to think CI/CD pipelines needed to be complex. Multiple stages, matrix builds, artifact caching, deployment gates. In practice, most projects just need: install dependencies, run tests, build. Everything else is optional until it isn't.

Here's the workflow I copy into new projects:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test
      - run: npm run build
```

That's it. `npm ci` instead of `npm install` because it's faster and respects the lockfile. Node 20 because 14 and 16 are dead. `actions/cache` is built into `setup-node` now, so you don't need a separate cache step.

## What I Add Later

- **Lint check** — `npm run lint` or `npx eslint .` before tests. Catches style issues before review.
- **Type check** — `npx tsc --noEmit` for TypeScript projects. Faster than a full build and catches type errors tests miss.
- **Deploy on tags** — a separate job that only runs on `v*` tags, building and pushing to the hosting platform.

## What I Don't Add

- Matrix builds across 4 Node versions for a side project. You're not publishing a framework.
- Complex artifact pipelines when `npm run build` takes 30 seconds.
- Deployment from `main` branch pushes. I deploy from tags so I can control when releases go out.

## The Real Value

The biggest benefit of CI isn't the automation—it's the social contract. When tests pass on CI, it means the code works in a clean environment, not just on your machine. When they fail, everyone sees it. That accountability matters more than any tooling choice.
