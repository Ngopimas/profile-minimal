---
author: Romain C.
pubDatetime: 2026-07-17T19:00:00Z
title: "Notes from a WebGL and CSS experiment"
slug: notes-from-a-web-gl-and-css-experiment
featured: false
draft: false
tags: ["web-development", "css", "webgl", "shaders", "design", "performance"]
description: "What I learned while building a standalone rendering experiment with WebGL 2, modern CSS, and a few careful fallbacks."
---

I built [The Browser Is a Material](/material/) to see how far I could take a standalone page with one fragment shader and current CSS. It was an experiment, not a template for how websites should look.

The page follows a simplified path from input to pixels: signal, style, layout, paint, composite, and photon. As the text moves through those stages, the shader changes shape with it.

I kept the page separate from the rest of this site. It has one Astro file, one stylesheet, and one JavaScript file. That made it easy to try things without turning the main site into a test bed.

## What I tried

The first idea was simple: use one changing object instead of six unrelated illustrations. It begins as noise, settles into nested forms, becomes a grid, gains a surface, separates into layers, and ends as light.

The sequence is a teaching device, not a complete browser architecture. Real rendering engines have more stages, shortcuts, caches, and implementation details than this page could reasonably show.

The text and the object share the same scroll position. That connection mattered more than adding another effect. When a section changes, the explanation and the visual move together.

## The shader

The WebGL scene starts with one oversized triangle:

```js
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 3, -1, -1, 3]),
  gl.STATIC_DRAW
);

gl.drawArrays(gl.TRIANGLES, 0, 3);
```

The triangle covers the viewport, which runs the fragment shader for every pixel. The shader creates the object from signed distance functions rather than downloaded models or textures.

For each pixel, a ray advances through that distance field for up to 88 steps. When it reaches a surface, the shader estimates a normal and applies light, color, glow, scan lines, and grain.

There are six distance functions, one for each section. Scroll sets a target scene. The render loop eases toward it and blends the two distance fields, so the object changes form instead of cutting to a new image.

I used WebGL 2 rather than WebGPU. This scene only needs a vertex shader, a fragment shader, and a few uniforms. WebGL 2 was enough, and it kept the experiment smaller.

## The CSS parts

CSS handles most of the page choreography. Scroll and view timelines move the progress line, title, sections, and large background words. The content still appears normally if those timelines are unavailable.

The field notes use a native popover. Where supported, anchor positioning attaches the panel to its button. `@starting-style` and discrete transitions handle its entrance and exit.

The page also tries container queries, OKLCH, `corner-shape`, `shape()`, typed custom properties, and `sibling-index()`. None of them is required to read or navigate the page.

That distinction was useful. A new feature was safe to try when its fallback was plain and understandable. The fallback did not need to look identical, but it needed to keep the same content and controls.

## What needed fixing

The shader was the obvious performance risk. Ray marching gets expensive as pixel density rises, so the renderer caps its density and lowers it on smaller or slower devices.

After 45 frames, it checks the measured frame rate. If that rate is low, the page reduces the rendering scale. I chose steady movement over a sharper image because softness is less distracting than lag here.

The first version checked all six section positions on every rendered frame. It now updates that state only after scroll or resize events. It also stops drawing when the tab is hidden.

A browser pass found smaller issues. The first navigation item did not receive `aria-current` on load because the scene state already started at zero. Starting it at minus one allowed the initial update to run.

Double clicking the large title also selected it like normal text. I disabled selection only for decorative interface elements. Paragraphs remain selectable, so the page still behaves like a document.

The layout diagram had a more visible mistake. Its CSS declared two rows, but one spanning rule left the fifth tile without a slot. Chrome created a 2px implicit third row and placed the empty tile there.

Those empty yellow boxes also looked like missing content. I removed the conflicting rule, labeled each track, and reduced the color. The diagram now shows the grid fractions instead of asking the reader to guess.

## What I would keep

I would not add this kind of shader to the rest of the site. It uses power, asks for attention, and makes simple changes more expensive.

The useful part was learning how little JavaScript the surrounding interface needed. CSS handled more of the timing and state than I expected, while WebGL stayed focused on the one task CSS could not do.

I would also keep the browser test. The most useful findings were not visible in a screenshot: selection behavior, initial accessibility state, a transition with no duration, and an implicit grid row.

Mostly, this was a chance to try unfamiliar tools in one contained place. Some parts worked. A few needed another pass. That was the point of making an experiment.

[Open the experiment.](/material/)
