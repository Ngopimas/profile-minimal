---
title: "Omaha Insights"
description: "A finance analytics web app for KPI monitoring, peer comparison, valuation work, and investment screening."
pubDatetime: 2025-06-10T09:00:00Z
tags: ["nextjs", "typescript", "tailwind", "recharts", "gcp"]
featured: true
url: "https://omaha-insights.com"
ogImage: "/assets/images/project-thumbs/omaha.jpg"
---

Omaha Insights is a finance analytics platform for people who need to compare companies, track performance, and turn financial data into decisions.

I worked on the product shape and the implementation: dashboards, charts, tables, peer comparison flows, screening tools, and the technical structure behind them.

![Omaha Insights](../../assets/images/omaha.png)

## What I built

- KPI dashboards with historical views and custom date ranges
- Peer comparison screens for benchmarking companies against competitors
- Valuation and sensitivity analysis interfaces
- Data tables with sorting, filtering, and export-oriented workflows
- Investment screening flows with reusable filter configurations
- Authentication and session handling through Clerk

## Product decisions

Finance tools can become unreadable very quickly. The work was less about adding charts everywhere and more about making the next action obvious: compare, filter, inspect, export, or save.

The UI needed to handle dense data without feeling like a spreadsheet clone. That meant reusable table patterns, consistent chart behavior, and enough spacing for the product to stay usable on smaller screens.

## What this shows recruiters

- Product engineering for data-heavy B2B workflows
- Strong frontend implementation with Next.js, TypeScript, Tailwind, and Recharts
- Ability to design interfaces around business analysis, not only visual polish
- Practical handling of authentication, user flows, and dashboard state
- Comfort working close to finance and investment use cases

## Stack

- Next.js, TypeScript, Tailwind CSS
- Radix UI for accessible components
- Recharts for visualization
- Clerk for authentication
- GCP for deployment and infrastructure pieces
