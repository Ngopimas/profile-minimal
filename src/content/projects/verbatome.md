---
title: "Verbatome"
description: "An interactive, bilingual web application for understanding language models from the inside: 14 lessons that follow text all the way to a next-token prediction, each carried by an instrument running a real toy computation."
pubDatetime: 2026-07-21T16:00:00Z
modDatetime: 2026-08-06T09:00:00Z
tags:
  [
    "astro",
    "react",
    "mdx",
    "interactive-explanations",
    "llms",
    "education",
    "bilingual",
  ]
featured: true
type: "Interactive book"
role: "Author, designer, and developer"
status: "Live"
impact: "A beginner can follow a sentence from raw text to a next-token prediction in English or French, and the numbers on screen come from computations they can open and inspect, not from illustrations."
url: "https://verbatome.com"
repository: "https://github.com/Ngopimas/verbatome"
ogImage: "/assets/images/project-thumbs/verbatome.png"
---

Verbatome is an interactive web application about how language models work, written for a beginner who wants to understand them from the inside. Across 14 lessons in four parts - from text to representations, inside the Transformer, prediction and learning, then from model to chatbot - the reader follows text all the way to a next-token prediction, and ends by separating the trained model from the context and orchestration that make it a chatbot.

The whole content exists twice: English at the root, French at `/fr/`. Same lessons, same instruments, and a French text re-authored around its own running example rather than translated.

<figure style="margin: 2.5rem 0;">
  <iframe
    src="https://verbatome.com"
    title="The live Verbatome home page, showing the course-trace hero and the four-part table of contents"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
    referrerpolicy="no-referrer"
    style="display: block; width: 100%; height: min(720px, 82svh); min-height: 520px; border: 1px solid rgb(var(--color-border)); border-radius: 12px;"
  ></iframe>
  <figcaption style="margin-top: 0.75rem; font-size: 0.875rem; color: rgb(var(--color-base)); opacity: 0.7;">
    The live site is embedded above, or <a href="https://verbatome.com" target="_blank" rel="noopener noreferrer">open Verbatome in its own tab</a>.
  </figcaption>
</figure>

## No faked numbers

The rule that shaped the project: explanations are carried by manipulable instruments, not static figures, and the instruments do not fake their numbers. Each lesson is built around one instrument whose computation the reader can inspect step by step.

That means the library behind the widgets is real, just small. A readable Byte Pair Encoding implementation trains, encodes, and logs every merge. A count model, a backoff model, and a tiny neural model compete on the same held-out text, so the comparison is fair rather than illustrative. Generation runs an actual block-to-logits-to-decoding loop, temperature included. When a lesson needs a handcrafted fixture instead, the page says so.

The payoff is honesty under manipulation. A reader can reverse a token sequence and prove why a Transformer needs positional information, or make the untrained toy place an absurd bet and then watch training flip it. The prose describes the same computation the instrument runs, so the two cannot quietly disagree.

## Two languages, one contract

Bilingual here does not mean translated. English is canonical for concept order and instrument state, but the French re-authors the meaning, down to the running example: where the English trace follows _orange_ and _apple_, the French follows _avocat_, which earns its place by doubling as the lawyer pun. Each chapter is one MDX file per language with matching validated frontmatter: stable id, objectives, prerequisites, instrument, and the lesson's place in the growing model. A terminology document owns definition order and the canonical French equivalents, and a voice charter scores every lesson pair before it ships, with no tolerated zero in correctness, causality, or bilingual parity. A concept matrix maps every lesson to its prerequisites, its misconception boundary, and its later payoffs.

## Verifying an explanation

The automated suite verifies the artifact. Thirty test files pin the numerical behavior of every toy implementation and the state contracts of the instruments; end-to-end runs cover both locales at desktop and mobile sizes with axe accessibility checks; a release-boundary test enforces what the shipped site may and may not do. Whether a beginner actually learns from it is a separate question, with its own reproducible five-session protocol and scoring rubric.

## Stack

- Astro 7 with static output - chapters ship as plain HTML
- React 19 islands for the instruments
- MDX chapters, one file per language, with Astro i18n routing
- Vitest for numerical and state-contract tests
- Playwright and axe-core for bilingual, responsive, accessible e2e runs
