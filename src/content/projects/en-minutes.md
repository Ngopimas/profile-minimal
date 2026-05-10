---
title: "En Minutes"
description: "A bilingual data visualization app that turns French prices into minutes of work, with historical data, salary references, and methodology checks built in."
pubDatetime: 2026-03-13T09:00:00Z
tags: ["react", "typescript", "data-visualization", "economics"]
featured: true
url: "https://enminutes.fr"
repository: "https://github.com/Ngopimas/enminutes"
ogImage: "/assets/images/project-thumbs/en-minutes.jpg"
image: "../../assets/images/project-thumbs/en-minutes-preview.png"
---

En Minutes answers a simple question: what does something cost if you measure it in work time instead of euros?

A baguette at 1.20€ today looks more expensive than a baguette in 1960. Raw prices are almost useless across decades, because inflation, francs, euros, wage growth, and tax changes all get mixed together. Minutes of work are easier to compare.

![How En Minutes works](../../assets/images/en-minutes-method.svg)

## What I built

The app tracks everyday French goods from the 1950s to today: baguettes, coffee, cinema tickets, rent, electricity, cigarettes, public transport, and more.

Users can switch between minimum wage, median salary, and mean salary. Every chart recalculates instantly, which changes the story in useful ways. Some goods got genuinely cheaper. Some did not. Some only look cheaper if you use the wrong salary reference.

![En Minutes app preview](../../assets/images/project-thumbs/en-minutes-preview.png)

## Why it matters

The first version used gross minimum wage data. That was wrong.

If the question is "how long do I need to work to buy this?", the salary reference should be net pay. Nobody buys groceries with gross salary.

Fixing that meant rebuilding part of the dataset. Recent net SMIC data is available from INSEE, but older years required reconstructing historical social contribution rates and checking the old franc to new franc conversion carefully. A small-looking accounting detail changed the whole app.

## What this shows recruiters

- Product thinking: the unit of measurement is the product, not just a chart setting
- Data judgment: I corrected the gross/net salary methodology instead of keeping a cleaner but wrong story
- Frontend execution: bilingual UI, dark mode, responsive charts, and instant recalculation in the browser
- Practical architecture: static deployment, no backend, no database, dataset bundled with the app

## Stack

- Vite, React, and TypeScript
- Tailwind CSS with shadcn/ui and Radix components
- Chart.js for interactive visualizations
- Framer Motion for light transitions
- GitHub Pages for deployment

I wrote a longer build note here: [Building a purchasing power visualizer with AI-assisted development](/posts/building-purchasing-power-visualizer-ai/).
