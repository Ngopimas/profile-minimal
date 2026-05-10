---
author: Romain C.
pubDatetime: 2026-05-10T17:30:00Z
title: "Building an autonomous research pipeline with Hermes Agent"
slug: building-autonomous-pea-research-pipeline
featured: true
draft: false
tags: ["ai", "investing", "automation", "dashboard", "python"]
description: "How an exploratory Hermes Agent project grew into a research system that finds European stock ideas, backtests strategies, checks assumptions before rebalancing, and publishes the evidence to a small dashboard."
ogImage: "/assets/images/pea-research-pipeline.svg"
---

I started this project as an excuse to push Hermes Agent beyond toy tasks.

The first version was simple: could an agent help maintain a small research workflow without me babysitting every step? Then the project grew. It started collecting data, generating ideas, running backtests, checking assumptions, and publishing the results to a dashboard.

The investing universe is deliberately narrow: European equities and PEA eligible instruments. That constraint makes the project more interesting. It forces the system to deal with messy tickers, uneven liquidity, and the kind of small cap names that do not show up cleanly in generic US first tooling.

![Autonomous research pipeline](../../assets/images/pea-research-pipeline.svg)

It is not meant to be a magic trading bot. If anything, the main goal is the opposite: make the process more boring, more inspectable, and less dependent on whatever idea happened to be interesting that morning.

## What the system does today

The pipeline has a simple loop.

It collects data on PEA eligible European stocks and ETFs. It generates research ideas. It turns some of those ideas into testable strategies. It runs backtests with transaction costs. It keeps only the strategies that clear basic viability thresholds. It checks whether the assumptions still hold before any rebalance. Then it writes the results to a static dashboard.

The current version includes:

- A PEA stock screener focused on European names
- ETF trend tracking for MSCI World, S&P 500, Nasdaq 100, and emerging markets
- Strategy generation and backtesting
- A paper portfolio with rebalance previews
- An assumption checker that can block a trade before it happens
- A dashboard with research evidence, live signals, agent logs, and system health

The dashboard matters more than it sounds. Most automation projects fail because the machine does things quietly and the human loses trust. I wanted the opposite. If an agent proposes a strategy, I want to see the evidence. If a trade is blocked, I want to know why. If two strategies secretly produce identical results because the dispatcher is wrong, I want the diagnostics to catch it.

## Why PEA makes this harder

A PEA eligible universe is a useful constraint, but it is not the easiest one to automate.

US data is clean, cheap, and everywhere. European equity data is messier. Tickers are less standardized. Liquidity varies a lot. Small caps can look statistically attractive until you account for spreads, turnover, and the fact that a backtest might be using stale or incomplete data.

There is also a practical constraint: this is not a generic global quant system. The point is to see whether Hermes Agent can run a focused research loop in a universe that is small enough to inspect.

That means Europe first. Stocks like ASML, Schneider Electric, LVMH, Hermes, Air Liquide, Vusion, and 2CRSI are more relevant here than another US mega cap screen. I am also interested in small cap alpha and occasional pump and dump type setups, but only if the system can separate a real signal from noise.

This is why the pipeline is built around checks rather than hype.

A strategy is not considered viable unless it clears both of these thresholds:

- Sharpe ratio above 0.5
- Maximum drawdown better than -30%

That is intentionally basic. It does not prove a strategy is good. It only filters out the obvious garbage before I waste time looking at it.

## The part I care about most: the pre-rebalance gate

The most useful component so far is the assumption checker.

A backtest can look fine and still be irrelevant today. The market regime may have changed. The strategy may have decayed. The latest data may be stale. A company may have earnings tomorrow. A momentum basket may have stopped behaving like momentum.

So before a paper trade rebalance, the system runs a gate with four checks:

- Strategy fitness: is the active strategy still behaving well enough?
- Market regime: does the current regime match the one the strategy was designed for?
- Data freshness: are the inputs recent enough to trust?
- Earnings risk: are we about to trade into an event we should avoid?

The output is deliberately blunt: proceed, hold, or abort.

![Pre-rebalance gate](../../assets/images/pea-pre-rebalance-gate.svg)

This changes the feel of the project. It is no longer just "find a strategy and trade it." It is closer to a small investment committee that asks: "Does the reason for this trade still exist?"

That one question prevents a lot of dumb automation.

## Why the dashboard is static

The dashboard is generated as static HTML and JSON, then served behind a simple Caddy reverse proxy.

That sounds low tech, but it is exactly what I want here. No database to babysit. No app server exposed to the internet. No login system built from scratch. The pipeline writes files, Caddy serves them, and the pages refresh from JSON.

The stack is mostly boring:

- Python for data collection, screening, backtesting, and report generation
- Jinja2 for static dashboard templates
- Cron for scheduled runs
- Caddy for serving the private tools page
- A few JSON and CSV files as the system state

The main dashboard is mobile first because that is how I actually use it. I do not need a Bloomberg terminal clone. I need a page that tells me, quickly, whether there is anything worth checking.

## What went wrong along the way

A few things broke in ways that were useful.

Some early strategies produced suspiciously identical backtest results. That is the kind of bug that looks like a research breakthrough if you are careless. It turned out the generic dispatch path was too generic, so different strategy definitions were effectively hitting the same logic. We added batch diagnostics after every strategy batch to catch clones.

Some strategy ideas could not be backtested properly. Fundamentals, intraday rules, and options logic do not fit the current daily price based engine. Instead of pretending, the system now detects and skips them.

The dashboard also had normal product bugs: mobile duplication, clipped tooltips, pages that looked useful in theory but were redundant in practice. Those details matter. If the interface is annoying, I stop using it. If I stop using it, the automation becomes theater.

## The role of AI agents

AI is not the strategy. It is the labor layer.

The agents help generate ideas, write code, inspect failures, add checks, and keep the pipeline moving. But the project works only when the agents are forced to leave evidence behind: logs, metrics, JSON outputs, backtest summaries, rejected ideas, and visible gates.

That is the pattern I trust more and more:

1. Let agents do the repetitive work.
2. Make every important output inspectable.
3. Add diagnostics where silent failure would be expensive.
4. Keep the final decision boring.

The best agentic systems do not feel like magic. They feel like a junior analyst who works all night, documents everything, and still needs a review process before anything touches money.

## What this project says about how I work

For recruiting, this is probably the clearest example of the kind of work I like doing: messy data, product constraints, automation, and a UI that has to stay useful after the novelty wears off.

A few parts are representative:

- I prefer inspectable systems over black boxes. The dashboard exposes logs, evidence, rejected ideas, and health checks.
- I care about failure modes. The system has diagnostics for duplicate backtest results, stale data, unsupported strategy types, and blocked rebalances.
- I build with boring infrastructure when boring is the right answer. Static files, JSON, cron, Jinja2, and Caddy are enough for this stage.
- I use agents as leverage, not as an excuse to skip review. The more autonomy the system gets, the more visible its reasoning needs to be.

## Where this is going

The near term goal is to make the loop more robust:

- Better European data coverage
- Cleaner strategy classification
- More realistic transaction cost and liquidity assumptions
- More evidence pages for rejected strategies, not only winners
- A tighter paper trading workflow before any real execution

Longer term, I want the system to become a personal research engine. It should surface new candidates, explain why they matter, test whether the idea has any historical support, and keep watching after the first signal.

The point is not to remove judgment. The point is to make judgment less random.

If this works, the output is not a bot that trades blindly. It is a process: data comes in, ideas are formed, evidence is produced, bad ideas are rejected, good ideas are watched, and every decision leaves a trail.

That is the project we are building.
