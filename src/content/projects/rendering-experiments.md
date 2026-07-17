---
title: "LUMEN & The Browser Is a Material"
description: "Two single-page rendering experiments testing how far the July 2026 web can go: WebGPU, WebGL 2, shaders, and the newest CSS. A raymarched optics bench, and a scroll essay drawn by the pipeline it describes."
pubDatetime: 2026-07-17T19:00:00Z
tags: ["webgpu", "webgl", "shaders", "css"]
featured: true
type: "Rendering experiments"
role: "Designer and developer"
status: "Live"
impact: "Zero-dependency scroll essays that trade video for live, GPU-computed graphics: a WebGPU optics bench and a WebGL 2 tour of the browser's rendering pipeline."
ogImage: "/assets/images/project-thumbs/lumen.jpg"
url: "/lumen/index.html"
---

These two pages come from the same starting point: take the newest things the web can do in July 2026 and find out how far a single, self-contained page can carry them. Not as a tech demo, but as something worth reading.

One experiment became an optics bench. The other turned the camera around and pointed it at the browser itself.

Both are single-page scroll essays. Neither ships a framework or a graphics library. Every frame is computed on the reader's GPU, and "informational" stayed a hard requirement: the graphics demonstrate the subject instead of decorating it.

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

This page was also the testbed for 2026 CSS: scroll and view timelines, anchor positioning, popovers, `@starting-style`, container queries, OKLCH. The rule for every feature was the same. It was safe to try when its fallback stayed plain and understandable.

The build notes are [The rendering pipeline, drawn by itself](/posts/notes-from-a-web-gl-and-css-experiment/).

## Shared DNA

The two pages share no code, but their answers rhyme:

- scroll is the only input: one number drives both the shader and the CSS
- a single fullscreen triangle and signed distance fields replace models, textures, and scene graphs
- CSS absorbed the interface logic that used to need scroll listeners
- each renderer measures itself and trades sharpness for steady motion
- every experimental feature ships with a plain, readable fallback, down to static text

The other shared result is a negative one, and it is worth as much: neither shader belongs on a normal content site. They spend power and attention. Both essays say so.

## Stack

- WebGPU and WGSL for LUMEN, with a WebGL 2 / GLSL ES 3.0 fallback
- WebGL 2 and GLSL for The Browser Is a Material
- vanilla JavaScript, no frameworks, no renderer dependencies
- CSS scroll-driven animations, anchor positioning, popovers, container queries
- one standalone HTML file for LUMEN; one Astro page, one stylesheet, one script for the material page
