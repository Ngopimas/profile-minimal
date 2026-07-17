---
title: "Écrivanalyse"
description: "A rebuild of Ivan Joseph's twenty-year literary archive: 3,157 SPIP pages recovered, reclassified, and published as a static Astro site designed around the language of the work."
pubDatetime: 2026-07-03T21:05:00Z
tags:
  [
    "astro",
    "digital-archives",
    "content-modeling",
    "web-design",
    "preservation",
  ]
featured: true
type: "Digital archive"
role: "Designer and developer"
status: "Live"
impact: "Old links from 2009 onward still reach the right work, Ivan's vocabulary survived intact, and the archive now rebuilds from plain inspectable files without a database or CMS."
url: "https://ngopimas.github.io/ecrivanalyse/"
repository: "https://github.com/Ngopimas/ecrivanalyse"
ogImage: "/assets/images/project-thumbs/ecrivanalyse.png"
---

Ivan Joseph has practiced _écrivanalyse_ since 2006. In a session, he writes a short text called a _quinte_ on a sheet of paper called a _quintesse_. The participant may acquire the object. The archive records the text, the encounter, and what became of the paper.

The original SPIP site had grown to 3,157 pages. I recovered the full public site, reclassified the corpus, designed a new reading experience, and rebuilt it as a static Astro archive.

Modernizing the stack was the straightforward part. Preserving distinctions drove the project. A quinte is not a quintesse. A six-line quinte still belongs even though the form usually has five. A session whose text was never published is still part of the archive. The new system had to remain precise without making the work more regular than it really is.

<figure style="margin: 2.5rem 0;">
  <iframe
    src="https://ngopimas.github.io/ecrivanalyse/"
    title="The live Écrivanalyse landing page, showing the wall of titles and the writing of one quinte"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
    referrerpolicy="no-referrer"
    style="display: block; width: 100%; height: min(720px, 82svh); min-height: 520px; border: 1px solid rgb(var(--color-border)); border-radius: 12px; background: #f6f1e7;"
  ></iframe>
  <figcaption style="margin-top: 0.75rem; font-size: 0.875rem; color: rgb(var(--color-base)); opacity: 0.7;">
    The live site is embedded above. Click the paper to finish the opening sequence, or <a href="https://ngopimas.github.io/ecrivanalyse/" target="_blank" rel="noopener noreferrer">open Écrivanalyse in its own tab</a>.
  </figcaption>
</figure>

## The preservation problem

The first step was a crawler, not a component library. I captured the old HTML, media, structured records, and public URLs before changing the interface. SPIP stored very different kinds of work as articles, so reading the corpus and correcting the parser had to produce a more honest inventory than the database's own categories:

- 3,047 quintes, including 39 whose text was never published online and one that belongs inside a longer prose page
- 97 longer texts from several serialized works
- 11 documentary pages about the practice and ÉOK editions
- two obsolete contact pages left out of the public archive

The exceptions shaped the model: the 39 unpublished quintes keep pages that explain where the text can be read, the hybrid page keeps its quinte at the point where it appears in the prose, and the longer works have their own collection. Each quinte lives in a YAML file whose `status` field stays free text - words such as _anniverchetée_ should not fail validation because a developer did not predict them.

## The reading experience

The home page needed to communicate both scale and intimacy, so I designed one opening choreography called "the wall, then the ink." Every title appears as a wall of type. One title comes forward, the camera moves toward it, and its quinte writes itself word by word, punctuation shaping the timing. When the writing is complete, the interface recedes and leaves the text still.

Every phase is skippable, and reduced-motion preferences receive the final composition immediately. After the first encounter, "rencontre au hasard" can select any readable quinte in the corpus while favoring entries the visitor has not met recently. The wall itself is texture, not navigation - the archive page provides the stable, searchable, keyboard-accessible list.

## Keeping the old site reachable

Seventeen years of links pointed at SPIP routes. The new 404 route recognizes old article, collection, author, and search URLs and forwards each shape - old search queries included - to its current equivalent. A link saved in 2012 reaches the work without asking the reader to understand the migration.

Every entry builds to static HTML. Pagefind indexes the generated site, each quinte receives its own Open Graph image, and the repository can rebuild the public archive without a database or CMS.

## Outcome

The production build contains nearly 17,000 files and weighs about 275 MB. GitHub Pages hosts it under a temporary project path while the final domain is prepared. A separate Worker is still needed for reader responses because their email moderation flow requires server-side endpoints.

The project now preserves the complete public corpus in three forms: a raw backup, structured source files, and a browsable site. New quintes can be added without changing the schema, including the next unexpected status phrase.

The main result is quieter than the opening animation. Someone can follow an old link, arrive at the right kind of work, understand what is present or absent, and still encounter Ivan's own language.

## Stack

- Astro 5 and TypeScript
- YAML content collections
- Pagefind for static search
- generated Open Graph images and per-quinte JSON
- GitHub Actions and GitHub Pages
- Python for crawling, enrichment, and content generation

The longer build story is [Rebuilding twenty years of writing meant learning its language](/posts/rebuilding-ecrivanalyse/).
