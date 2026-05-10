---
title: "En Minutes"
description: "A bilingual data visualization app that measures French purchasing power in minutes of work instead of raw prices."
pubDatetime: 2026-03-13T09:00:00Z
tags: ["react", "typescript", "data-visualization", "economics"]
featured: true
url: "https://enminutes.fr"
repository: "https://github.com/Ngopimas/enminutes"
image: "../../assets/images/en-minutes.png"
---

En Minutes started from a simple question: what does something really cost if you measure it in work time instead of euros?

A baguette at 1.20€ today looks more expensive than a baguette in 1960. But raw prices are almost useless across decades. Inflation, francs, euros, salary growth, and taxes all get mixed together. Minutes of work are easier to understand.

The app converts historical French prices into the number of minutes needed to earn them at a given salary level.

![En Minutes](../../assets/images/en-minutes.png)

## What it does

En Minutes tracks everyday French goods from the 1950s to today: baguettes, coffee, cinema tickets, rent, electricity, cigarettes, public transport, and more.

You can switch between minimum wage, median salary, and mean salary. Every chart recalculates instantly, which changes the story in a useful way. Some goods got genuinely cheaper. Some did not. Some only look cheaper if you use the wrong salary reference.

The app also includes:

- Product level charts in minutes of work
- Year to year comparisons
- An aggregated purchasing power index
- Inflation, productivity, and presidential overlays
- French and English support
- Dark mode, because charts should still be readable at night

## The part that made it interesting

The first version used gross minimum wage data. That was wrong.

If the question is "how long do I need to work to buy this?", the salary reference should be net pay. Nobody buys groceries with gross salary.

Fixing that meant rebuilding part of the dataset. Recent net SMIC data is available from INSEE, but older years required reconstructing historical social contribution rates and checking the old franc to new franc conversion carefully. A small-looking accounting detail changed the whole app.

That is what made the project worth keeping. It is not only a pretty chart toy. It is a reminder that economic visualizations are fragile. One wrong denominator and the story becomes cleaner, but less true.

## Stack

The app is static by design:

- Vite, React, and TypeScript
- Tailwind CSS with shadcn/ui and Radix components
- Chart.js for interactive visualizations
- Framer Motion for light transitions
- GitHub Pages for deployment

There is no backend and no database. The dataset ships with the app, and every derived value is calculated in the browser.

I wrote a longer build note here: [Building a purchasing power visualizer with AI-assisted development](/posts/building-purchasing-power-visualizer-ai/).
