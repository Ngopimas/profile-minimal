---
title: "Autonomous PEA research pipeline"
description: "A private investing research system for European equities: screen ideas, generate strategies, backtest them, run pre-rebalance checks, and publish the evidence to a mobile dashboard."
pubDatetime: 2026-05-10T17:35:00Z
tags: ["python", "ai", "investing", "automation", "dashboard"]
featured: true
url: ""
repository: ""
---

I am building a private research pipeline for my PEA portfolio.

The system collects market data, screens European stocks, generates strategy ideas, backtests them, and sends the useful results to a static dashboard. Before a paper rebalance, it also runs a pre-rebalance gate that can decide to proceed, hold, or abort.

## What it includes

- PEA focused stock screening for European equities
- ETF trend tracking for broad market context
- Strategy generation and batch backtesting
- Viability filters based on Sharpe ratio and maximum drawdown
- Transaction cost assumptions for more realistic results
- Paper portfolio tracking and rebalance previews
- A pre-rebalance assumption checker
- Static dashboard pages for signals, evidence, agent logs, and system health

## Why I built it

Manual research is easy to start and hard to repeat. I wanted a process that keeps the evidence attached to every idea: why it was generated, how it tested, why it was rejected, or why it deserves more attention.

The project is intentionally private because it touches personal investment workflows, but the architecture is simple: Python scripts, JSON outputs, Jinja2 templates, cron jobs, and static pages served behind Caddy.

I wrote more about the build in [Building an autonomous research pipeline for my PEA](/posts/building-autonomous-pea-research-pipeline/).
