---
author: Romain C.
pubDatetime: 2026-07-17T10:00:00Z
title: "Nothing on this page is a video"
slug: nothing-on-this-page-is-a-video
featured: true
draft: false
tags: ["webgpu", "wgsl", "css", "shaders", "web development"]
description: "LUMEN is a one-file scroll experience: a raymarched glass specimen whose physics change as you read. Raw WebGPU, no Three.js, and the 2026 CSS that replaced my scroll listeners."
---

I built a page where the only moving picture is math. It is called LUMEN. One piece of glass, one ray of light, five chapters. As you scroll, the glass morphs from a sphere into a lens, then a prism, a thin film, and a slab, and each shape demonstrates the phenomenon you are reading about: refraction, caustics, dispersion, interference, absorption. Every frame is raymarched on your GPU while you read.

The title is a claim, so let me argue it. A screen recording of this scene at 1080p costs about a megabyte per second, looks identical on every machine, and only plays forward. The whole page is 49 KB, which is less than one second of that recording. It renders at whatever resolution your screen happens to be. You can stop halfway through a refraction and stare as long as you like, or scroll up and watch the light bend back the way it came. The camera also leans toward your cursor a little, which no video will ever do.

None of this is bolted on. There is nothing to record in the first place: the whole page is a function of one number, and the number is your scroll position. A video is what you get when someone else evaluates a function once and ships you the output. This page hands you the argument instead.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/lumen/index.html" title="LUMEN, a live render teaser. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/lumen/index.html" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open LUMEN in a new tab &rarr;
  </a>
</div>

The frame above is the page itself, loaded in an iframe and cropped, so even the teaser is not a recording. You do not have to take my word for the rest. The full page prints its own frame rate and render scale in the footer, live, measured on your machine. Moving your pointer tilts the camera. And if you want proof you can type: open the console and enter `LUMEN.journey = 3.5`. The page jumps to the middle of the dispersion chapter without you scrolling anywhere, because the scrollbar was only ever one way of setting a number. The full experience is at [/lumen/](/lumen/index.html) and it wants a whole tab.

## Why a page and not a video

Every optics explainer I could find is a video, and video is a bad container for this subject. Compression hates smooth gradients, so the platform re-encodes your careful spectrum until the bands smear into each other. The framing and the resolution are frozen at whatever the author exported. Meanwhile the math that produces the picture fits on a page, and every laptop shipped in the last decade has a GPU that can evaluate it faster than it can decode video. So the format is the phenomenon itself, computed on the reader's own hardware. Whether the 2026 web could carry that in one file, with no build step, was the part I was not sure about when I started.

## Why this got easy in 2026

WebGPU is in every major browser now. Safari 26 shipped it, Firefox finished rolling it out across platforms, and Chrome has had it since 2023. You can write a WGSL shader for production without a compatibility table that makes you sad. CSS moved just as far: scroll-driven animations, anchor positioning, scroll-state container queries and `corner-shape: squircle` all sit in Chromium stable, and the first two are further along in the other engines than their reputation suggests. [MDN's scroll-driven animations page](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) keeps the current table.

LUMEN is one HTML file, about 1,400 lines and 49 KB. There is no framework and no build step. The fonts are the only external files, and they come from the same origin.

## The GPU half

People assume a demo like this ships Three.js. This one has no library at all, and not out of minimalism: the renderer draws a single triangle that covers the screen, and a fragment shader computes every pixel on it. There is no geometry to load and no scene graph to manage, so a library would have nothing to do. The whole WebGPU setup, pipeline and uniform buffer included, is about fifty lines. It is the function called `startWebGPU` in the source, if you want to check my count.

Scroll position compresses into a single float called `journey`. This is the number I keep talking about. The page is seven sections, hero to finale, and each one contributes 0 to 1 as it crosses the middle of your viewport, so `journey` runs from 0 at the top to 7 at the footer and the five chapters get centers at 1.5 through 5.5. Each chapter gets a triangle window around its center:

```wgsl
fn win(j: f32, c: f32) -> f32 {
  return smoothstep(0.0, 1.0, 1.0 - abs(j - c) / 1.15);
}
```

<svg viewBox="0 0 680 200" role="img" aria-label="The journey axis from 0 to 7 with five overlapping triangular windows, one per chapter, centered at 1.5 through 5.5. The dispersion window, centered at 3.5, is highlighted." style="width: 100%; height: auto; margin: 1.5rem 0; font-size: 11px;">
  <polygon points="68,150 160,55 252,150" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.4"/>
  <polygon points="148,150 240,55 332,150" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.4"/>
  <polygon points="228,150 320,55 412,150" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-opacity="0.85"/>
  <polygon points="308,150 400,55 492,150" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.4"/>
  <polygon points="388,150 480,55 572,150" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.4"/>
  <line x1="40" y1="150" x2="600" y2="150" stroke="currentColor" stroke-opacity="0.5"/>
  <g fill="currentColor" fill-opacity="0.55" text-anchor="middle">
    <text x="40" y="170">0</text><text x="120" y="170">1</text><text x="200" y="170">2</text><text x="280" y="170">3</text><text x="360" y="170">4</text><text x="440" y="170">5</text><text x="520" y="170">6</text><text x="600" y="170">7</text>
  </g>
  <g stroke="currentColor" stroke-opacity="0.5">
    <line x1="40" y1="150" x2="40" y2="155"/><line x1="120" y1="150" x2="120" y2="155"/><line x1="200" y1="150" x2="200" y2="155"/><line x1="280" y1="150" x2="280" y2="155"/><line x1="360" y1="150" x2="360" y2="155"/><line x1="440" y1="150" x2="440" y2="155"/><line x1="520" y1="150" x2="520" y2="155"/><line x1="600" y1="150" x2="600" y2="155"/>
  </g>
  <g fill="currentColor" fill-opacity="0.75" text-anchor="middle">
    <text x="160" y="42">refraction</text>
    <text x="240" y="26">caustics</text>
    <text x="320" y="42" fill-opacity="1">dispersion</text>
    <text x="400" y="26">thin film</text>
    <text x="480" y="42">absorption</text>
  </g>
  <g fill="currentColor" fill-opacity="0.45" text-anchor="middle" font-style="italic">
    <text x="80" y="188">hero</text>
    <text x="560" y="188">finale</text>
  </g>
</svg>

Dispersion is chapter three, centered at `journey = 3.5`, so `win(j, 3.5)` fades it in and out as you scroll through. The same trick drives the shape morph, the camera distance, and the exposure. The scene is a signed distance field, sphere-traced in up to 80 steps, with a second march through the interior of the glass to find the exit point.

Refraction traces three rays per pixel, one per color channel, each with its own index of refraction. The loop body is compressed to a comment here, but the numbers are the real ones:

```wgsl
let dispersion = 0.05 + 0.95 * win(j, 3.5);

for (var c = 0; c < 3; c++) {
  let off = (f32(c) - 1.0) * 0.055 * dispersion;
  let ior = 1.458 + off + 0.06 * absorb;
  /* refract in, march the interior, refract out, sample what sits behind */
}
```

For most of the page the offset stays near zero and the three rays agree. Inside the dispersion chapter it peaks at 0.055 and white light visibly tears into a spectrum at the prism edges.

Thin film interference is a cosine palette driven by viewing angle, which is [Inigo Quilez's trick](https://iquilezles.org/articles/palettes/). Crude, but it produces the same bands you see on a soap bubble, in the same order. Absorption is honest Beer-Lambert. The interior march already knows the path length through the glass, so extinction is two lines:

```wgsl
let sigma = vec3f(1.15, 1.75, 0.55) * (absorb * 1.9 + 0.04);
trans *= exp(-sigma * pathLen);
```

Green pays the highest toll and blue the lowest, so the thicker the glass gets, the further it drifts toward violet.

The caustics are the one place I cheated. Real caustics need photon mapping, or at least bundles of rays and somewhere to accumulate them. The pool of light under the specimen is an analytic interference pattern that lives inside the contact shadow. It is fake. It also looks more like the bottom of a swimming pool than anything this page could afford to compute honestly, so the fake stays.

## The CSS half

The shader is only one consumer of the scroll number. The other is CSS itself, and the part that surprised me is how much page logic it absorbed.

The chapter rail on the right highlights the active chapter with zero JavaScript. Each chapter declares a named view timeline, the body hoists the names into scope, and the fixed rail labels animate against them:

```css
body { timeline-scope: --ch1, --ch2, --ch3, --ch4, --ch5; }
#c1  { view-timeline: --ch1; }
#rail a[href="#c1"] {
  animation: rail-on linear both;
  animation-timeline: --ch1;
}
```

For contrast, here is the version of that rail I have been writing since roughly 2019:

```js
const io = new IntersectionObserver(entries => {
  for (const e of entries)
    document.querySelector(`#rail a[href="#${e.target.id}"]`)
      .classList.toggle('on', e.isIntersecting);
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => io.observe(s));
```

That, plus the `.on` class, plus the afternoon you spend tuning the rootMargin so two chapters never light up at once. The CSS version does not contain that afternoon. It is also continuous: the highlight tracks scroll position instead of flipping a boolean, so the rail crossfades where the old one blinked.

The rest of the page follows the same pattern. The sticky chapter headers dress themselves when they actually stick, through a `scroll-state(stuck: top)` container query. The physics footnotes are popovers pinned to their trigger words with anchor positioning, and they animate in from `@starting-style`. The colophon panel transitions to `height: auto` because `interpolate-size` finally makes that legal. Each one of these was a scroll listener and a class toggle five years ago. I wrote none of those listeners.

Scroll still reaches the shader through one small JS bridge, since uniforms live outside CSS. That bridge is the only place the two halves touch, and the only scroll state that crosses it is `journey`. Two renderers, one number.

## Three things that bit me

WGSL refused to compile `fwidth()` in my floor shading. The floor is only reached from divergent branches, and WGSL's [uniformity analysis](https://www.w3.org/TR/WGSL/#uniformity) forbids derivative calls there, because neighboring pixels might have taken different paths. GLSL happily lets you do this and returns garbage at the seams. WGSL making it a compile error is the better design. It still cost me a debugging session. The fix was estimating line width from camera distance instead of from screen derivatives.

The swapchain died silently. If the canvas ever hits zero size, even for one layout flap, `getCurrentTexture()` starts returning invalid textures and never recovers on its own. The console fills with errors while the page shows a black rectangle. I now clamp the canvas to a minimum of 2 pixels and reconfigure the context whenever an uncaptured error fires.

And requestAnimationFrame is not guaranteed to fire. Embedded webviews and previews can report `document.hidden = true` forever while the page is plainly on screen, and rAF just never ticks. A render loop that only advances on rAF is a frozen frame in those contexts. So LUMEN runs a slow interval as a watchdog, and if no frame has rendered for 90 ms it ticks manually:

```js
setInterval(() => {
  if (rafAlive && document.hidden) return;
  if (performance.now() - lastRun > 90) tick(false);
}, 30);
```

The first line matters more than it looks. A hidden tab in a real browser also suspends rAF, and there the correct response is the opposite one: stop rendering entirely. The `rafAlive` flag separates the two cases. If rAF has ever fired, the browser's visibility reporting can be trusted, so a hidden tab stays dark. If rAF never fired at all, the page is inside one of the broken embeds and the watchdog carries it.

## What reading this costs

A page that renders every frame while you read is spending your battery, and it should at least be honest about that. LUMEN measures itself and adapts. It averages the last forty frame times; when the average creeps past 19 ms it cuts the render scale by 15 percent, down to a floor of 0.45, and when frames come in under 9 ms it climbs back up, capped at your device pixel ratio or 2, whichever is smaller. The pair of numbers in the footer is this loop reporting live. A machine that cannot hold 60 fps reads the same page, slightly softer. A hidden tab renders nothing at all.

## Degradation

The ladder has three rungs. WebGPU with WGSL first. WebGL2 second, running the same scene translated to GLSL ES 3.0, because the two languages map almost one to one. No GPU at all gets a static gradient and the full text, which is fine, because the text works without the glass.

`prefers-reduced-motion` freezes the time-based animation but keeps the scroll-driven changes. You cause those yourself, at your own pace, so they stay.

The source is one file and I left it unminified on purpose. If some part of it still reads as video to you, open [/lumen/](/lumen/index.html), view source, and look for the frames. There are none. There is an equation, and a number your scrollbar happens to control.
