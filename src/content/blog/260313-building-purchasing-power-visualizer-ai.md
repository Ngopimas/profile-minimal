---
author: Romain C.
pubDatetime: 2026-03-13T20:00:00Z
title: "Building a Purchasing Power Visualizer with AI-Assisted Development"
slug: building-purchasing-power-visualizer-ai
featured: true
draft: false
tags: ["react", "data-visualization", "ai", "side-project", "economics"]
description: "How I built an interactive app to measure French purchasing power in minutes of minimum wage - from a magazine article to a fully deployed tool, with AI as a copilot."
---

A few years ago, I stumbled upon an article in [Alternatives Économiques](https://www.alternatives-economiques.fr/) that tried to answer a deceptively simple question: did the switch to the euro actually make things more expensive in France? The article used an elegant trick - instead of comparing raw prices (which inflation makes meaningless over time), it measured how many **minutes of minimum wage** you'd need to earn to buy everyday items.

That idea stuck with me. What if you could explore that concept interactively?

This post is about how I built [Pouvoir d'Achat en Minutes](https://github.com/ngopimas/enminutes) - a basic bilingual, interactive data visualization app that lets you explore the real cost of everyday French goods from the 1950s to today - and how AI-assisted development shaped the process.

## The Core Idea

The premise is simple: a baguette costs around €1.20 today. But is that expensive? Compared to what?

Raw prices are deceiving. A baguette cost 0.24 francs in 1950 - sounds cheap, but the minimum wage was about 0.64 francs per hour. That means earning a baguette took roughly **22 minutes of work**. Today, it takes around **4 minutes**.

By converting every price into minutes of SMIC (the French minimum wage), you get a universal unit that cuts through inflation, currency changes, and decades of economic shifts. It lets you compare a 1955 pack of cigarettes to a 2024 one in a way that actually means something.

## What It Does

The app tracks **everyday items** - from baguettes and coffee to cinema tickets and metro rides - across seven decades of data. Here's what you get:

- **Interactive charts** for each product, showing its cost in minutes of SMIC over time, with an optional inflation overlay
- **A comparison modal** where you pick two years and instantly see whether something got cheaper or more expensive to earn
- **Key insights cards** highlighting the most striking trends (cigarettes 3× more expensive, baguette 4× cheaper)
- **A purchasing power index** that aggregates everything into a single trend line
- **Basket composition** showing how a typical consumer basket has shifted over the decades
- **Bilingual support** - every label, tooltip, and insight toggles between French and English
- **Dark mode** with a cool palette and gold accents

## The Stack

I went with a modern, static-first approach:

- **Vite + React 18 + TypeScript** - fast dev loop, type safety, zero backend needed
- **shadcn/ui + Radix** - accessible, composable UI components (Select, Dialog, Switch, Tabs)
- **Tailwind CSS v3** - utility-first styling with a custom CSS variable system for theme switching
- **Chart.js + react-chartjs-2 + chartjs-plugin-annotation** - the charting layer, with annotation support for historical events (euro introduction, COVID)

The whole app is statically built - no server, no API, no database. All the data lives in a single TypeScript file. It deploys to GitHub Pages with a simple workflow.

## Data: The Hard Part

Sourcing 70 years of consumer prices in France is not as straightforward as you'd think. There is no single API that gives you the price of a baguette in 1962.

I ended up combining multiple sources:

- **INSEE** - France's national statistics institute, the gold standard for price indices and SMIC history
- **Sénat reports** - surprisingly detailed historical price surveys
- **BoulangerieNet** - an industry site that tracked baguette prices over decades
- **Historical press** - newspaper archives for items like cinema tickets and stamps

For the SMIC, I used the official [INSEE annual series](https://www.insee.fr/fr/statistiques/1375188) going back to 1980, complemented by historical SMIG data for earlier decades.

Each product has a data array mapping years to prices - in francs before 2002, in euros after. The app normalizes everything at render time by dividing the price by the per-minute SMIC rate for that year. No pre-computation, no derived datasets to maintain.

**Tip:** When working with French economic data, always check whether amounts are in "anciens francs" (pre-1960), "nouveaux francs" (1960-2002), or euros. Getting this wrong will silently give you results that are off by a factor of 100.

### Keeping the Data Fresh

One thing I didn't want was a project that goes stale the moment I stop manually updating it. So the repo includes a GitHub Actions workflow that runs every February 1st (INSEE typically publishes full-year data in January). It:

1. Fetches the latest SMIC rates and product prices from the [INSEE SDMX API](https://www.insee.fr/fr/statistiques/series/103157792) - no auth required
2. Computes new CPI inflation figures from the IPC index
3. Only **adds** new years to the dataset - it never modifies historical data
4. Opens a pull request with a full diff for review before anything gets merged

The script uses two strategies depending on the product: some have direct "prix moyens annuels" series on INSEE (actual retail prices in euros), while others use IPC indices calibrated against a known anchor price. If any fetch fails, it skips that source rather than risking partial corruption.

It's a ~200-line Node script, intentionally conservative. The human still reviews and merges - but the tedious part of pulling numbers from government APIs is automated.

## AI as a Development Partner

This project was built almost entirely through iterative prompting with [Perplexity Computer](https://www.perplexity.ai/computer). Not as a code generator that spits out a scaffold and walks away - as a persistent collaborator across dozens of rounds of refinement.

Here's what that actually looked like in practice.

### The Feedback Loop

The workflow wasn't "prompt → get code → done." It was closer to pair programming where one partner has infinite patience:

1. **Start with intent**: "Build an interactive purchasing power visualizer for France, 30+ items, bilingual, Chart.js"
2. **Review, critique, redirect**: "The comparison format (2.0× −50%) is confusing. Try natural language instead."
3. **Iterate on details**: "Move the year dropdowns above the values, not beside them."
4. **QA together**: The AI ran Playwright tests at each step - desktop, mobile, dark mode, edge cases.

Each round produced a deployable build. The project went through a brutalist redesign, a full shadcn/ui migration, and dozens of UX refinements - all within the same continuous session.

### Where AI Excelled

- **Boilerplate and wiring**: Setting up Vite, Tailwind, Chart.js config, the i18n translation layer, dark mode CSS variables - the stuff that's well-documented but time-consuming. This went from hours to minutes.
- **Variant generation**: "Give me 4 logo options" or "Try 3 different comparison layouts" - exploring the design space quickly.
- **Cross-cutting refactors**: When I decided to swap the entire design to brutalist style, the AI rewrote every component in one pass.
- **Visual QA**: Automated screenshot comparison across breakpoints and themes caught layout issues I would have missed.

### Where I Stayed in the Driver's Seat

- **Data curation**: Deciding which items to include, finding and verifying historical prices, handling edge cases (items that didn't exist in the 1950s, price discontinuities during the franc-to-euro transition).
- **Editorial judgment**: What story does the data tell? Which insights deserve to be highlighted? The AI can compute that cigarettes cost 3× more in minutes of SMIC - but the decision to feature that as a key insight is a human one.
- **Design direction**: I drove the aesthetic decisions - the palette, the brutalist phase, the eventual refinement. The AI executed faithfully, but the taste was mine.
- **UX calls**: Removing a broken share button, choosing natural language over ratio notation, deciding that the "Faits marquants" section adds value - these are judgment calls that require understanding the end user.

## A Few Things I Learned

### 1. Minutes of SMIC > Raw Prices

This is the single most important design decision in the project. Showing that a baguette went from 0.24F to €1.10 tells you nothing. Showing it went from 22 minutes to 4 minutes tells a story. The unit of measurement _is_ the narrative.

### 2. Bilingual Is Not Just Translation

Supporting French and English isn't just about swapping strings. Number formatting differs (virgule vs. period), some concepts don't translate cleanly ("SMIC" needs explanation in English), and cultural context matters - a French user immediately knows what a "timbre" is; an English user might not.

### 3. Static Data, Dynamic Feel

The entire dataset is a TypeScript file. No API calls, no loading states, no backend. Yet the app feels dynamic because all the computations - minute conversions, comparisons, index aggregation - happen at render time in the browser. This keeps the architecture dead simple while enabling rich interactivity.

### 4. AI Iteration Speed Changes the Process

When each design iteration takes 2 minutes instead of 2 hours, you explore more options. I went through a full brutalist redesign, decided it wasn't right, reverted, and refined - all in a single evening. That kind of rapid prototyping used to require a team. Now it requires clarity about what you want.

## TL;DR

- **"Minutes of SMIC" is a powerful lens** for understanding purchasing power - it normalizes across inflation, currency changes, and decades.
- **Everyday items over 70+ years of data**, all in a static React app with Chart.js, shadcn/ui, and Tailwind.
- **AI-assisted development** worked best as an iterative loop: intent → build → critique → refine. The human brings taste and editorial judgment; the AI brings speed and consistency.
- **The hard part is always the data**. No API will give you the price of a croissant in 1965. You need to dig.

## Further Reading

- [INSEE - Salaire minimum de croissance (Smic)](https://www.insee.fr/fr/statistiques/1375188) - Official SMIC annual data from 1980 to present
- [Alternatives Économiques - Pouvoir d'achat](https://www.alternatives-economiques.fr/pouvoir-dachat-1802202197694.html) - Economic context and definitions
- [Europe1 - Le prix d'une baguette en minutes de travail](https://www.europe1.fr/economie/Le-prix-d-une-baguette-c-est-desormais-14-minutes-de-travail-763946) - UFC-Que Choisir's similar approach using average salary
- [Mouvement Européen - L'euro et les prix](https://mouvement-europeen.eu/uedecryptee-est-ce-que-leuro-a-fait-exploser-les-prix-a-la-consommation/) - Debunking the "euro inflation" myth
