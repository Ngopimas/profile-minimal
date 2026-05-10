---
title: "Autonomous research pipeline"
description: "An exploratory Hermes Agent project for European equities: screen ideas, generate strategies, backtest them, run pre-rebalance checks, and publish the evidence to a dashboard."
pubDatetime: 2026-05-10T17:35:00Z
tags: ["python", "ai", "investing", "automation", "dashboard"]
featured: true
url: ""
repository: ""
ogImage: "/assets/images/project-thumbs/autonomous-research-pipeline.svg"
---

This is the main project I am building around Hermes Agent: a research loop that goes from market data to ideas, from ideas to strategies, from strategies to backtests, and from backtests to a static dashboard.

The investment universe is deliberately constrained to European equities and PEA eligible instruments. That makes the problem more interesting. European tickers are messier than US tickers, liquidity matters more, and small caps can produce very misleading backtests if the system does not check its own assumptions.

![Autonomous research pipeline](../../assets/images/pea-research-pipeline.svg)

## What I built

- A Python pipeline for screening European equities and ETFs
- Strategy generation and batch backtesting
- Viability filters based on Sharpe ratio and maximum drawdown
- Transaction cost assumptions so results are not unrealistically clean
- A paper portfolio with rebalance previews
- A pre-rebalance assumption checker that can proceed, hold, or abort
- Static dashboard pages for signals, evidence, agent logs, and system health

## The part that matters

The most useful part is the pre-rebalance gate.

A good-looking backtest can still be irrelevant today. The strategy may have decayed, the data may be stale, the market regime may have shifted, or the next earnings date may make the trade a bad idea. Before a paper rebalance, the system checks those assumptions instead of blindly following the latest signal.

![Pre-rebalance gate](../../assets/images/pea-pre-rebalance-gate.svg)

## What it says about my work

- Agentic workflow design: I am not only prompting agents, I am building guardrails, diagnostics, and evidence trails around them
- Data engineering: the pipeline has to normalize messy European market data and survive scheduled runs
- Product sense: the dashboard is mobile first because the useful output is a quick decision, not another complex terminal report
- Risk awareness: the system can reject its own output before paper trading touches it
- Pragmatism: static HTML, JSON files, Jinja2, cron, and Caddy are boring, but they are easy to audit and operate

## What I learned

The hard part is not making an agent generate ideas. That part is cheap.

The hard part is making the system notice when two strategies secretly use the same generic dispatch path, when a strategy cannot be backtested with daily prices, or when a valid historical result should not be traded today. The pipeline is becoming less like a bot and more like an analyst workbench: generate, test, reject, document, repeat.

I wrote more about the build in [Building an autonomous research pipeline with Hermes Agent](/posts/building-autonomous-pea-research-pipeline/).
