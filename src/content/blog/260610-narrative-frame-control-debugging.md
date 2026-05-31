---
author: Romain C.
pubDatetime: 2026-06-10T10:00:00Z
title: "The bug is not the bug"
slug: narrative-frame-control-debugging
featured: false
draft: false
tags: ["debugging", "root-cause-analysis", "incident-response", "software-engineering"]
description: "Whoever defines the bug controls the investigation. The first plausible explanation is a trap."
---

A colleague spent four hours optimizing a database query last week. The query was not slow. The endpoint was calling it too much times.

The bug report said "dashboard is slow." He looked at the database first because that is where slow usually lives. The database was fine. The query was fine. The number of calls were the problem, and nobody thought about counting them first.

The report set the frame. The frame trapped the investigation.

I have been on the other side too. I once reported "memory leak in the worker process". A colleague spent days profiling memory. The real problem was a connection pool that never released connections. Memory was a symptom. Connections were the disease. My frame sent them to the wrong place.

Whoever defines the bug controls the investigation. The first plausible explanation becomes gravity. Everything else orbits around it.

## How frames get set

Frames come from the reporter. A user says "the page is slow". A monitoring alert says "CPU above 90 percent". A colleague says "it worked yesterday". Each of these sets a starting point. The investigation begins there and expands outward, which means the first frame constrains everything that follows.

Frames also come from the first responder. The engineer who picks up the ticket reads the description, forms a hypothesis, and starts investigating. If the hypothesis is wrong, the investigation is working on the wrong problem from the beginning. The earlier the wrong frame, the longer the incident.

I have a rule now: I do not start investigating until I have rewritten the bug report in my own words. Not a summary. A reframe. "It is slow" becomes "it is slow for some users starting at 9am" or "it is slow on this specific endpoint" or "it is fast until the cache expires". The more specific the reframe, the less room for the original frame to mislead.

## Frames that trap

I have seen the same framing mistakes repeatedly.

**"It is slow" leads to performance investigation.** The system is not slow. It is returning wrong data and the client is retrying. The retries look like slowness. The fix is an idempotency key, not an index.

**"It crashes on deploy" leads to deployment investigation.** The deployment is fine. A data migration ran during the deploy window and locked a table. The crash was a query timeout. The fix is running migrations separately.

**"It works in staging" leads to environment investigation.** The environments are identical. The difference is data volume. Staging might have 10,000 rows when production has 10 million. The query plan is different. The fix is the same index you already have in staging but never needed.

In every case, the investigation followed the frame. The frame was reasonable. The frame was also wrong.

## Reframing techniques

I use four techniques to break a bad frame.

**Inversion: "It is fast until X."** Instead of describing the problem, describe when the problem starts. "It is fast until the third payment attempt" is more useful than "payments are slow". The first explanation is a search space. The second is a clue.

**Temporal shift: "When did this last work correctly?"** Not "when did it break". The question assumes the system was once correct and is now broken. Sometimes the system was always broken and the failure mode just changed. The answer changes the investigation.

**Scope change: "What would make this system fail in a completely different way?"** This question breaks the frame by asking what the current frame excludes. If all your monitoring points to the database, this question makes you look at the network. If all your tests pass in isolation, this question makes you test the integration.

**"What am I assuming?"** This is the most useful question and the one I forget most often. Every investigation runs on assumptions. The data is fresh. The deploy was clean. The config did not change. The tests pass. Naming the assumptions lets you test them. Sometimes the assumption is the bug.

## Who has the power

In an incident, the person who names the bug has power. If an incident commander says "this is a database problem", the database team owns it even if the problem is the application layer. If a senior engineer says "check the network", the network gets checked even if the real problem is a typo in a config file.

This is not a technical problem. It is a social problem. The power to frame is the power to direct attention. In a well-run incident, the frame gets challenged. "We think this is the database, but what else could it be?" is a question that should be asked every 30 minutes.

In a poorly-run incident, the frame is set by whoever speaks first or loudest.

## The practical version

I keep a notepad open during incidents. At the top, I write the frame: "We believe the issue is X." Every 30 minutes, I read it and ask: "Is this still true? What have we learned that contradicts this?"

Sometimes the answer is "yes, still true, and here is more evidence." Good. Keep going.

Sometimes the answer is "we have been investigating X for two hours and found nothing." That is the signal to reframe. Pick a different X. Start over.

The most expensive debugging sessions I have been in were not expensive because the bug was hard. They were expensive because the frame was wrong and nobody challenged it for two days.

The best debugging tool is not a profiler or a debugger. It is the willingness to say: we might be looking at the wrong problem.

I say it out loud now. Not to be difficult. Because the sentence saves more hours than any tool I own.
