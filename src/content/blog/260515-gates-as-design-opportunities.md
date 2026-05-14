---
author: Romain C.
pubDatetime: 2026-05-15T10:00:00Z
title: "Gates are where the architecture got better"
slug: gates-as-design-opportunities
featured: false
draft: true
tags: ["ai", "software-architecture", "automation", "testing", "agents"]
description: "What changed when checkpoint gates stopped being just approval steps and became the place where the architecture improved."
---

Fast autonomous building is seductive.

Give the agent the spec. Let it work. Come back to a pull request, a passing test suite, and a neat summary of what changed.

That is useful for chores. It is much less useful for architecture.

The best parts of `pea-pilot` did not come from letting Hermes run for longer. They came from stopping it at the right moments.

`pea-pilot` is an autonomous European equities research and paper trading system. It is being built phase by phase with Hermes as the build agent and me as the reviewer. The process is intentionally slow: plan first, test first, implement, stop before commit, show evidence, wait for approval, commit one checkpoint, then stop again.

That sounds like bureaucracy until you see what happens at the gates.

The gates are where the system got better.

## The loop

Every meaningful checkpoint followed the same rhythm.

Hermes proposed a plan before writing code. The plan included scope, open questions, tests, expected files, and the commit message.

I reviewed the plan. Sometimes I approved it. Sometimes I answered a question. Sometimes I rejected an assumption.

Hermes wrote failing tests first. Then it implemented until the tests passed. Then it stopped before committing and showed the evidence: test output, code samples, rationale, and any design tradeoffs.

Only after that did I approve the commit.

Then it stopped again.

That final stop matters. Without it, the agent keeps moving. It fixes one thing, starts the next thing, folds two decisions into one commit, and turns review into archaeology.

One checkpoint, one evidence package, one commit. It is slower. It is also much easier to reason about.

## A gate is not just a quality check

At first I treated gates as verification points.

Did the tests pass? Did the code match the plan? Did the acceptance criteria survive? Did the agent avoid scope creep?

Those are still useful questions. But the more interesting pattern was different: gates became design opportunities.

A gate creates a pause with enough context loaded to ask a better question than the original plan asked.

That is rare. During implementation, the agent is biased toward completing the current path. During upfront design, everyone is still guessing. At the gate, the shape of the code is visible, but still fresh enough to change.

That is the sweet spot.

## Phase 2.4: the duplicate RiskAgent problem

The first run graph design was simple. Agents were the nodes.

A daily run might look like DataAgent, ScraperAgent, ResearchAgent, BacktestAgent, RiskAgent, AllocatorAgent, PaperTraderAgent, ReportAgent.

That works until the same agent appears twice.

In the daily graph, `RiskAgent` needs to run before allocation as a pre-flight check. It also needs to run after paper trading as a post-trade check.

If the graph node is just `AgentName.RISK`, which one does another node depend on?

That question came up at the Phase 2.4 gate. It was not some huge architectural revelation. It was a small naming problem. But small naming problems often reveal bad models.

The fix was to separate the node's identity from the agent implementation.

A run template node now has a `node_key`, an `agent_name`, and `required_node_keys`.

The same `RiskAgent` can appear as `risk_preflight` and `risk_post_trade`. Dependencies point to node keys, not agent names. The graph no longer needs special-casing for duplicate agents.

That design was not in the original spec.

It emerged because the gate created enough friction for the question to be asked.

## Phase 2.5: the import smell

Another gate changed where execution schemas live.

The first plan placed `OrderIntent` and `ExecutionResult` in `app.execution.interface`. That sounds reasonable. They are execution concepts.

But during review, Hermes noticed the consequence: any future agent that wanted to type-hint an execution request would need to import from the execution package.

That was the wrong dependency direction.

The executor is concrete. The schema is a boundary object. Agents should be able to talk about an intended order without importing the thing that places it.

So the schemas moved to `app.schemas.execution`, while concrete execution code stayed in `app.execution`.

Then we added static tests to defend the boundary. Orchestration must not import from execution. Data modules must not import from execution. These are not style preferences. They are enforced.

Again, this was not a dramatic rewrite. It was a small gate correction.

But this is exactly where architecture lives: in the direction of imports, in what is allowed to know about what, in whether future code will be easy to place correctly or easy to place badly.

## Phase 2.2: time semantics matter

The `agent_runs` table originally had `started_at`.

Then the orchestrator design changed. It eagerly persisted all nodes in the run graph when a run group was created. Downstream nodes existed in the database as `pending` before they had started.

That made `started_at` awkward. A pending run has been created, but it has not started.

Forcing a value into `started_at` would make the schema lie.

The fix was to separate `created_at` from `started_at`.

`created_at` records when the row entered the graph. `started_at` records when execution actually began.

That sounds obvious once written down. It was still worth catching early, because timestamps become audit language. If the audit trail lies about when work started, every downstream duration and timeout becomes suspect.

The gate made the semantic mismatch visible before the table became normal.

## The agent was not the only designer

One surprising part of this process is that Hermes sometimes proposed the better architecture.

The keyed-node redesign came from a reviewer question. The schema-location pattern came from the agent spotting future import creep. The timestamp split came from the implementation forcing a semantic distinction the original docs had blurred.

None of that fits the usual story where the human designs and the agent types.

The collaboration is messier than that.

The human supplies taste, constraints, refusal, and fatigue. The agent supplies tireless implementation and sometimes catches consequences the human did not spell out. The spec supplies shared language. The gate supplies the pause.

Remove any one of those and the result gets worse.

## Why not let the agent fix issues immediately?

Because fixing during the gate mixes two jobs.

A gate is for surfacing and classifying findings. Implementation is for fixing them.

That distinction became important during the Phase 3 final gate. Hermes found a real integration bug: `MarketDataRefresher` raised `DataUnavailableError` instead of returning a failed `DatasetRefreshOutcome`. Unit tests on both sides had passed, because each side mocked the other to match its own expectation.

The right move was not to patch it inline and pretend the gate had passed.

The right move was to record the finding, classify it, decide whether it blocked phase closure, then fix it in a separate commit.

That keeps the evidence clean.

If a gate both discovers and fixes issues in the same breath, it becomes hard to tell what was actually validated. The transcript turns into a blur of "found something, changed something, tests pass now."

That is not enough for a system whose main promise is inspectability.

## Slow is not the point

I do not think slow process is automatically good.

A lot of software process is just fear with checklists.

The useful part here is not slowness. It is the shape of the pause.

A good gate has fresh context, concrete code, failing-or-passing tests, and enough authority to change direction. It is close enough to implementation to see real problems and far enough from commit to avoid cementing them.

That is why the architecture improved there.

Not because the plan was perfect. Not because the agent was magical. Because the process left room for the better answer to arrive late.

## What I would keep

If I had to reduce the whole method to a few rules, I would keep these:

- plan before implementation
- write tests before code
- stop before commit
- show evidence, not summaries
- classify findings before fixing them
- commit one checkpoint at a time
- do not auto-progress after approval

The last one is the hardest in practice.

When you are tired, it is tempting to say "fix this and continue." The agent can do it. That is the problem. It will happily cross the boundary you needed for review.

The better instruction is: fix this, show evidence, commit if approved, then stop.

A gate is only useful if it is allowed to interrupt momentum.

That is the lesson I keep taking from `pea-pilot`. The point of an AI build agent is not to remove all friction. Some friction is structural. Some friction is where the design gets better.
