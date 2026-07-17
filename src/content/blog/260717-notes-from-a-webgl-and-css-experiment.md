---
author: Romain C.
pubDatetime: 2026-07-17T19:00:00Z
title: "The rendering pipeline, drawn by itself"
slug: notes-from-a-web-gl-and-css-experiment
featured: false
draft: false
tags: ["web-development", "css", "webgl", "shaders", "design", "performance"]
description: "The Browser Is a Material walks from markup to photons, and the object illustrating each stage is drawn by the pipeline it describes. Notes on WebGL 2, new CSS, and what a browser pass caught."
---

I built [The Browser Is a Material](/material/) as a scroll essay about how a browser turns markup into light. It follows a simplified pipeline: signal, style, layout, paint, composite, photon.

There is a loop in that premise. The object demonstrating each stage is itself being parsed, styled, laid out, painted, and composited while you read about it. The page is its own diagram.

One changing object carries the whole essay instead of six unrelated illustrations. It begins as noise, settles into nested forms, becomes a grid, gains a surface, separates into layers, and ends as light.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/material/" title="The Browser Is a Material, a live WebGL and CSS experiment. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/material/" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open the experiment in a new tab &rarr;
  </a>
</div>

The text and the object share the same scroll position. That connection mattered more than any individual effect: when a section changes, the explanation and the visual move together.

The sequence is a teaching device, not a browser architecture. Real engines have more stages, shortcuts, and caches than one page could reasonably show.

The page lives apart from the rest of this site: one Astro file, one stylesheet, one script. Nothing it tries can turn the main site into a test bed.

## The shader, briefly

The renderer uses the same skeleton as [LUMEN](/posts/nothing-on-this-page-is-a-video/), the WebGPU experiment from earlier this week: one oversized triangle covers the viewport, and a fragment shader computes every pixel on it.

The object is built from signed distance functions, one for each of the six sections. A ray marches through that field for up to 88 steps per pixel. A hit gets a normal, light, color, glow, scan lines, and grain.

Scroll sets a target scene. The render loop eases toward it and blends two distance fields, so the object changes form instead of cutting to a new image.

I used WebGL 2 rather than WebGPU this time. A vertex shader, a fragment shader, and a few uniforms did not need more, and the older API kept the experiment smaller. The technique lives in the LUMEN post; these notes are about everything around it.

## CSS carried more than expected

The stylesheet is 1,857 lines. The script is 648, and more than 270 of those hold the shader source. Nearly all of the page choreography belongs to CSS.

Scroll and view timelines move the progress line, the title, the sections, and the large background words. Where those timelines are unavailable, the content simply appears.

The field notes use a native popover. Where supported, anchor positioning attaches the panel to its button, and `@starting-style` with discrete transitions handles its entrance and exit.

The page also tries container queries, OKLCH, `corner-shape`, `shape()`, typed custom properties, and `sibling-index()`. None of them is required to read or navigate anything.

That was the test for every feature: it was safe to try when its fallback stayed plain and understandable. The fallback did not need to look identical. It needed the same content and the same controls.

## What the browser pass caught

The shader was the obvious performance risk. Ray marching gets expensive as pixel density rises, so the renderer caps its density and lowers it on smaller or slower devices.

After 45 frames it checks the measured frame rate, and if the rate is low it reduces the rendering scale. I chose steady movement over a sharper image, because softness is less distracting than lag.

The first version also checked all six section positions on every rendered frame. It now updates that state only after scroll or resize, and it stops drawing entirely when the tab is hidden.

Then I ran a browser pass, and the most useful findings were the ones no screenshot would show.

The first navigation item never received `aria-current` on load. The scene state already started at zero, so the initial update saw nothing to change. Starting it at minus one forced that first update to run.

Double clicking the large title selected it like ordinary text. I disabled selection on the decorative interface elements only. Paragraphs remain selectable, so the page still behaves like a document.

The best bug picked the most fitting place to live: the layout section shipped with a layout bug. The diagram's CSS declared two rows, but one spanning rule left the fifth tile without a slot.

Chrome resolved that quietly, by creating a 2px implicit third row and placing the empty tile there. Two stray yellow boxes sat under the diagram, looking exactly like missing content.

I removed the conflicting rule, labeled each track, and reduced the color. The diagram now shows its grid fractions instead of asking the reader to guess.

## What survives the experiment

I would not add this shader to the rest of the site. It spends power, asks for attention, and makes simple changes more expensive. That counts as a result of the experiment, not a failure.

The part worth keeping is how little JavaScript the interface needed. CSS handled more of the timing and state than I expected, while WebGL stayed focused on the one task CSS cannot do.

The browser pass is worth keeping too. Selection behavior, initial accessibility state, a transition with no duration, an implicit grid row: none of it is visible in a screenshot.

Mostly, this was a contained place to try unfamiliar tools. Some parts worked. A few needed another pass. That was the point of making an experiment.

[Open the experiment.](/material/)
