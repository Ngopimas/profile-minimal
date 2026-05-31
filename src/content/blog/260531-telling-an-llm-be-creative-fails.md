---
author: Romain C.
pubDatetime: 2026-05-31T14:00:00Z
title: "Telling an LLM to 'be creative' is one of the worst things you can do"
slug: telling-an-llm-be-creative-fails
featured: false
draft: false
tags: ["ai", "creativity", "llm", "research", "agents"]
description: "Why telling an LLM to 'be more creative' does not work, what Arthur Koestler's bisociation theory suggests instead, and how I adapted the Open-Collider method into a Hermes skill."
---

I asked GPT-5.5 to generate article ideas for this website. Five ideas came
back. Generic, safe, interchangeable. I added more context. Same cluster. I
said "be creative." Still the same cluster, different words. The model was not
being lazy. It was doing exactly what probability dictates: following the
highest-probability path through its training data, more context refining the
path but never redirecting it.

Then I ran the same brief through a bisociation pipeline that injects
structurally distant knowledge domains into the prompt. The ideas were
different. Not just different words. Different angles entirely.

That pipeline comes from [Open-Collider](https://github.com/CL-ML/open-collider),
a project by Cedric Lion at Oparine. The numbers behind it are striking.

## What the research found

Open-Collider tested four conditions across 12 real-world projects, generating roughly
23,000 ideas, judged by 4,320 blind LLM-judge verdicts. The conditions:

- **A (Open-Collider):** Inject structurally distant domains into the prompt.
- **B (Baseline):** Standard direct prompting.
- **C ("Be Original"):** Explicit instruction to be creative.
- **D (Long Brief):** Rich, detailed in-domain context, same length as A, no
  cross-domain content.

The falsifier tests are what make this convincing. If pure length explained the
shift, D would match A. It does not: D's effect is 2.8 to 4 times smaller. If
a "be original" push worked, C would match A. It does not: C's effect is 5.7 to
13 times smaller. A beat all other conditions on geometric distance in 12 out of
12 projects (p = 0.0002), using two different embedding models.

The uncomfortable conclusion: telling an LLM to be creative is one of the least
effective things you can do. Adding more in-domain context is the second least
effective. The only thing that consistently produces outputs far from the default
basin is forcing the model to reason through something it would never encounter
on its own.

## The theory: idea space and gravitational fields

The mental model comes from Arthur Koestler's 1964 work on bisociation. Picture
an idea space where proximity means similarity. A prompt creates a gravitational
cluster. The model generates responses near that cluster, pulled by two forces:

1. Local gravity from the prompt itself, concentrated by more words.
2. Global gravity from the aggregate of training data, pulling everything toward
   the mediocre center.

Adding more in-domain context increases the local gravity, but toward your
already-known ideas, not toward original ones. The response gets sharper, not
more creative.

The solution is structural collision. Take two subjects far apart in idea
space. Force them into the same prompt. The bet is that they share a hidden
dimension, a causal structure invisible from the surface. When that dimension
exists, the collision transfers mechanism across domains and produces a
non-trivial insight. When it does not exist, you get a decorative analogy.

The method needs volume because most collisions miss. It needs curation because
the misses look similar to the hits. And it needs iteration because the first
round of domains is usually too safe.

## The Open-Collider pipeline

The project built a 4-phase loop:

**Domain generation.** The LLM produces sets of structurally distant knowledge
domains. Not random topics. Each domain has an "active principle": a 3-6
sentence narrative describing a counter-intuitive mechanism, ending with an open
question that bridges to the project's problem. The constraint is maximize
distance from the project's territory and diversity between sets.

**Idea generation.** Cross reference texts (articles, transcripts, research
notes) with domain sets. Each (text, domain) combination produces roughly 20
ideas. The prompt forces the model to structurally use the domain mechanism, not
just name-drop it. It also demands axiomatic inversions: ideas that flip an
implicit assumption.

**Scoring.** A 5-axis LLM judge evaluates each idea: originality, resistance to
objection, thesis density, concrete grounding, cognitive load. Weighted sum.
Threshold at 4.2 out of 5, with an adaptive drift mechanism that lowers the
threshold in 0.1 steps if too few ideas pass.

**Curation.** A human flags each idea as love, like, or trash. This is not
decoration. The flags drive the next iteration.

After iteration 1, the pipeline evolves its domain strategy. Three modes:
Fresh (random distant domains, pure exploration), Deepen (new specialties
within families that produced loved ideas), and Refresh (extract causal
mechanisms from best ideas, find new disciplines with the same structural
patterns). Loved ideas trigger Deepen. Liked ideas trigger Refresh. Sessions
typically exhaust after 3 to 5 iterations.

The source code is at [CL-ML/open-collider](https://github.com/CL-ML/open-collider),
the conceptual foundation at the README, and the empirical validation at
[CL-ML/open-collider-research](https://github.com/CL-ML/open-collider-research).

## What I adapted and why

I did not want to run the Anthropic SDK orchestration. The project's API mode
is locked to Claude. The skill mode requires Claude Code subagents. I use Hermes
with multiple providers, and I wanted the method to work regardless of which
model is behind it.

So I ported the prompts and the strategy logic as a Hermes skill. The prompts
are ported directly from Open-Collider's templates. The domain generation
prompts for fresh, deepen, and refresh strategies are essentially unchanged. The
idea generation prompt is the same. The judge prompt with its 5 axes and
calibration framework is the same. The intellectual content is Lion's.

What changed is the runtime. Instead of asyncio with Anthropic SDK calls, the
pipeline uses parallel agent calls instead. Instead of a Python
orchestrator managing concurrency with semaphores and retry logic, Hermes
handles the parallelism natively. Instead of YAML state files with a full
Python package managing iteration state, I use JSON files that the agent
reads and writes directly.

The curation guide and kill signals (decorative analogies, generic advice with
domain garnish, unverifiable claims, motivational reframing) are new. They came
from reading Open-Collider's brainstorm.md command and reworking the curation step into
something an agent could present to a human during an interactive session.

The result is simpler. No Python package to install. No API key requirement.
The skill loads into any Hermes session. But it is also less automated. The
original has async parallel idea generation with stratified sampling and
concurrency control. The Hermes version delegates that to agent calls, which
is more flexible but less predictable in timing.

The BGE embedding distance measurement from the research branch is not
included. It validates that outputs are geometrically distant, which is useful
for benchmarking but not for the production method. The judge's originality
axis handles quality. Distance is structural, not measured.

## What I found interesting

The most counterintuitive claim in the research is that adding more context makes
things worse. Not neutral, worse. I would have expected a richer brief to help.
The data says it concentrates the response deeper into the same basin. That
changes how I think about prompting for creativity.

The second thing: the curation step is where the method earns its value. The
machine generates volume. The human selects signal. The kill signals matter more
than the scoring. An LLM judge gives you a number. A human catches the decorative
analogy, the generic advice with domain garnish, the motivational reframing. The
scoring is necessary but not sufficient.

The third thing: the 3-strategy evolution (fresh/deepen/refresh) is the part I
did not expect to be so well-designed. Fresh is obvious. Deepen exploits what
worked. Refresh is the clever one: it extracts causal mechanisms from best ideas
and finds new disciplines with the same structural patterns. That is not just
exploration or exploitation. It is transfer.

## What the prompts look like

The prompts are the method. Here is what matters.

**Domain generation (fresh strategy).** The prompt tells the LLM to generate
sets of structurally distant knowledge domains in strict YAML. Each domain gets
an "active_principle": a 3-6 sentence narrative. The key instruction:

> Each domain has an active_principle: a 3-6 sentence narrative describing a
> counter-intuitive mechanism and ending with an open question bridging to the
> project's world.

The prompt excludes families used in previous iterations to prevent repetition.
The deepen prompt generates new specialties within families that produced loved
ideas. The refresh prompt extracts causal mechanisms and finds new disciplines
with the same structural patterns.

**Idea generation.** The prompt crosses a reference text with a domain list.
It demands:

> Each idea structurally different (different angle, not just different theme).
> Max 2 ideas on the same theme. Max 2 ideas using the same analogy type.
> No hedging, no filtering.

It also asks for axiomatic inversions: "X is good" explored as "X might be
the problem." At least 5 ideas must invert an implicit assumption.

**The judge.** Five axes, weighted:

| Axis                   | Weight | Question                                      |
| ---------------------- | ------ | --------------------------------------------- |
| Structural originality | 0.25   | Is the underlying thesis genuinely new?       |
| Resistance             | 0.20   | Does it hold against the strongest objection? |
| Thesis density         | 0.20   | Could it be a single testable thesis?         |
| Concrete grounding     | 0.20   | Could it rely on a specific fact or event?    |
| Cognitive load         | 0.15   | Does it force the reader to reconstruct?      |

Score = weighted sum. Pass threshold: 4.2/5. If fewer than 3 ideas pass, lower
in 0.1 steps down to 4.0. The judge prompt includes calibration examples:
high-value and low-value reference ideas that ground the scoring.

**Curation kill signals.** Five patterns that get flagged automatically:

- Decorative analogy: domain adds color but no structural insight
- Generic advice with domain garnish: remove the domain reference and the
  idea stays the same
- Unverifiable claims: invented statistics, vague "researchers found..."
- Motivational reframing: "Your failure was actually a strength"
- Same insight different domain: keep only the stronger formulation

These are patterns that LLM judges miss but humans catch immediately.

## When this is useful

This is not a general-purpose creativity tool. It works when:

- You have a specific problem that standard thinking has not cracked.
- You can articulate what a good idea looks like structurally.
- You have reference material that defines one side of the collision.
- You are willing to spend 3 to 5 iterations curating, not just generating.

It does not work when the problem is too broad, when you want a single-shot
answer, or when the brief cannot be made specific enough to anchor the
collisions.

---

## Further reading

- [Open-Collider](https://github.com/CL-ML/open-collider) - source code and pipeline
- [Open-Collider research](https://github.com/CL-ML/open-collider-research) - empirical validation
- [Why direct prompting pushes LLMs toward mediocrity](https://cdriclion.substack.com/p/why-directprompting-pushes-llms) - the conceptual foundation by Cedric Lion at [Oparine](https://oparine.ai)
