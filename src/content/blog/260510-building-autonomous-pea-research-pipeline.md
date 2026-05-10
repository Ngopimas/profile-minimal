---
author: Romain C.
pubDatetime: 2026-05-10T17:30:00Z
title: "Agents are useful when they leave receipts"
slug: building-autonomous-pea-research-pipeline
featured: true
draft: false
tags: ["ai", "investing", "automation", "dashboard", "python"]
description: "How an exploratory Hermes Agent project became a European equity research pipeline built around evidence trails, backtests, assumption checks, and a dashboard that can say no."
ogImage: "/assets/images/pea-research-pipeline.svg"
---

I did not set out to build a trading bot. That sounds like a very efficient way to automate bad decisions.

The better question was smaller: can Hermes Agent help run a research process without turning it into a black box?

The answer so far is yes, but only if the system is forced to leave receipts. Every idea needs evidence. Every strategy needs a backtest. Every backtest needs diagnostics. Every rebalance needs a gate that can say no.

That is the project: a European equity research loop where agents do the tedious work, but the important decisions stay inspectable.

![Evidence trail for the autonomous research pipeline](../../assets/images/pea-research-pipeline.svg)

## The thing I trust least is the thing I built first

The first version was a normal automation pipeline. It collected market data, generated ideas, tested strategies, and published the results somewhere I could read them.

Useful, but also dangerous in the way most agent projects are dangerous: the machine can look busy while quietly being wrong.

A strategy can pass a backtest because the dispatch path is too generic. A ticker can look liquid because stale data is hiding the spread. A strategy can make sense historically and still be a bad trade today because the regime changed or earnings are tomorrow.

So the project moved away from "let the agent trade" and toward something more boring:

- generate ideas
- test them with costs
- reject weak or unsupported strategies
- log the evidence
- block rebalances when assumptions break
- publish the whole trail to a dashboard

That last part matters. If I cannot inspect the result from my phone in 30 seconds, I will not trust it when it runs without me.

## Why Europe makes the problem more annoying

The investment universe is deliberately constrained: European equities and PEA eligible instruments.

That constraint is useful because it keeps the system focused, but it also removes a lot of the easy mode you get with US-first tooling. European tickers are messier. Liquidity varies more. Some small caps look brilliant until you account for turnover, spreads, missing data, or the fact that the signal barely trades.

The project cares more about names like ASML, Schneider Electric, LVMH, Hermes, Air Liquide, Vusion, or 2CRSI than another clean US mega-cap screen. It is also designed to handle speculative small-cap setups, but only if the system can separate a real signal from noise.

That is why the first filter is intentionally blunt. A strategy is not even considered viable unless it clears both:

- Sharpe ratio above 0.5
- Maximum drawdown better than -30%

That does not prove the strategy is good. It just keeps the obvious garbage out of the room.

## The gate is the product

The most important component is not the idea generator. Idea generation is cheap now.

The useful part is the pre-rebalance gate.

Before the paper portfolio rebalances, the system asks whether the reason for the trade still exists. It checks strategy fitness, market regime, data freshness, earnings risk, thesis health, and sector rotation. The output is deliberately blunt: `proceed`, `hold`, or `abort`.

![Pre-rebalance gate](../../assets/images/pea-pre-rebalance-gate.svg)

That changes the feel of the whole project. It is no longer "find a strategy and follow it." It is closer to a small investment committee that has no patience for vibes.

The gate can block a trade even when the strategy was historically viable. That is the point. A backtest is evidence, not permission.

## The dashboard is not decoration

The dashboard is where trust is built or lost.

Most automation projects hide the awkward parts in logs, which means the user sees the pretty output and misses the caveats. I wanted the opposite. The dashboard has to show signals, evidence, rejected ideas, agent logs, system health, and the reason a rebalance was blocked.

The stack is intentionally boring:

- Python for data collection, screening, backtesting, and report generation
- Jinja2 for static dashboard templates
- Cron for scheduled runs
- JSON and CSV files as system state
- Caddy serving the private dashboard

No database to babysit. No app server exposed to the internet. No heroic infrastructure. The pipeline writes files, the generator turns them into pages, and Caddy serves them.

That sounds low tech, but it has one big advantage: when something matters, it leaves a file behind.

## The bugs that made it better

The best improvements came from things breaking in suspicious ways.

Some early strategies produced identical backtest results. That can look like a breakthrough if you are not paying attention. It was not. Different strategy definitions were hitting the same generic dispatch logic, so the system was testing clones and pretending they were independent ideas.

The fix was not just patching that bug. We added batch diagnostics after every strategy batch to catch clone results automatically.

Other ideas could not be backtested properly. Fundamentals, intraday rules, and options logic do not fit the current daily-price engine. The wrong move would be to force them through anyway and get a clean-looking nonsense result. The system now detects and skips them.

The dashboard had normal product bugs too: duplicated mobile sections, clipped tooltips, redundant pages, missing active states. Less glamorous, but just as important. If the interface becomes annoying, I stop using it. If I stop using it, the automation becomes theater.

## What agents are actually good for here

AI is not the strategy. It is the labor layer.

The agents help generate ideas, write code, inspect failures, add checks, and keep the pipeline moving. But they are useful only when their work is surrounded by evidence.

The pattern I trust looks like this:

1. Let agents do the repetitive work.
2. Make every important output inspectable.
3. Add diagnostics where silent failure would be expensive.
4. Keep the final decision boring.

The best agentic systems do not feel like magic. They feel like a junior analyst who works all night, writes everything down, and still needs review before anything touches money.

## What this project says about how I work

This is probably the clearest example of the kind of work I like: messy data, product constraints, automation, and a UI that still has to be useful after the novelty wears off.

A few parts are representative:

- I prefer inspectable systems over black boxes. The dashboard exposes logs, evidence, rejected ideas, and health checks.
- I care about failure modes. The system has diagnostics for duplicate backtest results, stale data, unsupported strategy types, and blocked rebalances.
- I build with boring infrastructure when boring is the right answer. Static files, JSON, cron, Jinja2, and Caddy are enough for this stage.
- I use agents as leverage, not as an excuse to skip review. The more autonomy the system gets, the more visible its reasoning needs to be.

## Where it is going

The near-term work is mostly about making the loop harder to fool:

- better European data coverage
- cleaner strategy classification
- more realistic transaction cost and liquidity assumptions
- stronger evidence pages for rejected strategies, not only winners
- tighter paper-trading workflow before any real execution

Longer term, I want the system to become a research engine that keeps watch after the first signal. It should surface candidates, explain why they matter, test whether the idea has historical support, monitor whether the thesis is decaying, and show the evidence without me digging through logs.

The point is not to remove judgment.

The point is to make judgment less random.
