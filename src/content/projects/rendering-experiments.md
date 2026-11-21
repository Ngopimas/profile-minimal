---
title: "Rendering experiments: LUMEN, Material, QUARTO, NOSCRIPT"
description: "Four standalone pages testing how far the 2026 web can go without a framework: a WebGPU optics bench, a WebGL 2 tour of the rendering pipeline, an article folded into a booklet with HTML-in-Canvas, and a zine with no JavaScript."
pubDatetime: 2026-07-17T19:00:00Z
modDatetime: 2026-11-13T10:00:00Z
tags: ["webgpu", "webgl", "html-in-canvas", "shaders", "css"]
featured: true
type: "Rendering experiments"
role: "Designer and developer"
status: "Live"
impact: "Four zero-dependency pages where the graphics demonstrate the subject: two GPU scroll essays from July 2026, then a selectable article printed on a folding sheet and a six-page zine written in HTML and CSS only."
ogImage: "/assets/images/project-thumbs/lumen.jpg"
url: "/lumen/index.html"
---

These pages come from the same question, asked twice in 2026: take the newest things the web can do this month and find out how far one self-contained page can carry them. The answer has to be something worth reading, not a tech demo.

The first two, from July, are scroll essays drawn by a shader. The second two, from November, each take away something the first pair leaned on. QUARTO gives the shader real text instead of a scene. NOSCRIPT takes away the script.

None of the four ships a framework or a graphics library. One rule held throughout: the graphics demonstrate the subject and never decorate it.

## LUMEN

A field study of light passing through glass. One specimen, one ray, five chapters: refraction, caustics, dispersion, thin-film interference, absorption. As you scroll, the glass morphs from a sphere into a lens, a prism, a film, and a slab.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/lumen/index.html" title="LUMEN, a live render teaser. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/lumen/index.html" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open LUMEN in a new tab &rarr;
  </a>
</div>

One HTML file, about 1,400 lines and 49 KB, written in raw WebGPU and WGSL. A fullscreen triangle, a fragment shader, and scroll position compressed into a single float that the shader and the CSS both consume.

The page measures its own frame times and trades render scale for steady motion, with the numbers printed live in the footer. Degradation has three rungs: WebGPU, the same scene in WebGL 2, and a static gradient with the full text.

The full argument is [Nothing on this page is a video](/posts/nothing-on-this-page-is-a-video/).

## The Browser Is a Material

A scroll essay about how a browser turns markup into light: signal, style, layout, paint, composite, photon. The premise contains a loop. The object demonstrating each stage is itself being parsed, styled, laid out, painted, and composited while you read about it.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/material/" title="The Browser Is a Material, a live WebGL and CSS experiment. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/material/" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open the experiment in a new tab &rarr;
  </a>
</div>

A WebGL 2 fragment shader raymarches six signed distance fields, one per pipeline stage, and blends between them as you scroll. The interface around it is mostly CSS: a 1,857-line stylesheet against a 648-line script.

The build notes are [The rendering pipeline, drawn by itself](/posts/notes-from-a-web-gl-and-css-experiment/).

## QUARTO

An essay about how a printed booklet is made, set on one sheet of paper that folds twice into eight pages. The paper is a mesh. The ink is the article's own DOM, drawn into textures with HTML-in-Canvas, which shipped in Chrome 157 in October 2026. You can select the text on the sheet, tab through its links, and double-click a word on a page that is printed upside down.

<a href="/quarto/index.html" style="position: relative; display: block; margin: 1.5rem 0; border-radius: 8px; overflow: hidden; color: white; text-decoration: none; font-weight: 500;">
  <img src="/assets/images/project-thumbs/quarto.jpg" alt="The QUARTO press sheet before folding: four pages of an essay on tilted paper, two of them printed upside down." loading="lazy" style="display: block; width: 100%; height: auto; margin: 0;" />
  <span style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open QUARTO in a new tab &rarr;
  </span>
</a>

Each chapter does to the article what a printer does to a sheet. It is folded, with the page order computed by folding the mesh and not read from a table. It is separated into cyan, magenta, yellow and black and screened into halftone dots. The plates are brought into register, the fold is sewn, and the edges are trimmed to the crop marks.

One file, 3,089 lines and 113 KB, on the WebGL 2 entry point of the API. The live sheet needs Chrome or Edge 157 and a page at least 410 pixels wide. Every other browser, and every phone, gets the same essay as a plain typeset article.

The write-up is [You can still select the text](/posts/you-can-still-select-the-text/).

## NOSCRIPT

A zine of six HTML documents about the jobs the web used to hand to JavaScript: the scroll listener, the click handler, the overlay, the loop, the router. Each page does its own job in front of you with HTML and CSS only. There is no script element, no canvas and no event handler, and a Content-Security-Policy of `script-src 'none'` on every page to back that up.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/noscript/index.html" title="NOSCRIPT, a zine with no JavaScript. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/noscript/index.html" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open NOSCRIPT in a new tab &rarr;
  </a>
</div>

The specimens include a three-dial combination lock made of thirty radio buttons on 3D drums, rings of tiles placed by one `sibling-index()` rule, a reading progress bar that prints its own percentage, and page turns between documents done with cross-document view transitions.

About 135 KB in all, with one 2,501-line stylesheet. Each recent feature sits behind `@supports`, and the fallback is always the content laid flat with working links. The cover lists what the approach cannot do: remember, read a value, or talk to a server.

The write-up is [Nothing on this page is JavaScript](/posts/nothing-on-this-page-is-javascript/).

## What the four share

The pages share no code. They share a handful of decisions:

- no framework, no graphics library, no build step for the page itself, and source left unminified
- the visual is the explanation: glass that refracts, a pipeline that draws itself, an article that gets printed, a lock that is its own state machine
- every experimental feature ships with a plain, readable fallback, down to static text
- CSS carries the interface, and in NOSCRIPT it carries everything
- the pages that render continuously measure themselves, and all of them stop drawing when there is nothing to draw

They also disagree, and that is the more useful result. The July essays conclude that their shaders do not belong on a normal content site, because they spend power and attention. QUARTO's main idea runs in one browser engine. NOSCRIPT is the only one whose techniques I would mostly put into production as they are.

## Stack

- WebGPU and WGSL for LUMEN, with a WebGL 2 / GLSL ES 3.0 fallback
- WebGL 2 and GLSL for The Browser Is a Material
- HTML-in-Canvas over WebGL 2 for QUARTO
- HTML and CSS only for NOSCRIPT: view transitions, scroll-driven animations, `:has()`, anchor positioning, popovers, invoker commands, `sibling-index()`, `random()`
- vanilla JavaScript where there is any; no frameworks, no renderer dependencies
