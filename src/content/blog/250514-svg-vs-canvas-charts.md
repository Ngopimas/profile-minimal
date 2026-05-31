---
author: Romain C.
pubDatetime: 2025-05-14T10:00:00Z
title: "Count the Marks, Not the Library Stars"
slug: svg-vs-canvas-charts
featured: false
draft: false
tags: ["data visualization", "frontend", "performance", "charts", "javascript"]
description: "Before you pick Recharts or Chart.js, ask whether your chart should be made of objects or pixels."
---

3,200 DOM nodes. 2.1 seconds in style recalc. 8 seconds to first paint on a mid-range Android.

This is what a scatter plot looks like when you render every point as an SVG circle. The library was fine. The renderer choice was wrong.

I keep seeing this pattern. A team picks a chart library from the demo page. The demo has 12 pretty data points. Production has 8,000. Mobile users stare at a white rectangle for eight seconds, then close the tab.

The root cause is rarely the library. It is that nobody asked whether the chart should be made of objects or pixels.

## SVG and Canvas are not chart libraries

They are rendering models. The choice between them determines performance, accessibility, testability, and how much pain you will feel when the product manager asks for "click any point to drill down."

**SVG** builds charts from structured elements: `<svg>`, `<rect>`, `<path>`, `<text>`. The browser tracks every mark as a DOM node with styles, events, bounding boxes, and hit testing. You can inspect it in DevTools. You can style it with CSS. You can make individual elements interactive.

**Canvas** gives you a rectangular drawing surface. You paint pixels into it. Once drawn, the browser does not remember what those pixels represent. There are no nodes. There is no tree. There is no "hover this specific bar." There is a bitmap.

That tradeoff explains most of the performance bugs people blame on React or "too much data."

## SVG charts are documents

SVG makes sense when the chart is part of the page's meaning.

A bar chart with 50 bars, annotations, and accessible tooltips wants to be a document. The browser should understand that a bar is a bar. A label is a label. A threshold line is semantically different from the data.

This is why Recharts feels natural for product dashboards. You are composing semantic elements, not painting pixels. Monthly revenue trends, funnel visualizations, KPI comparisons with direct labels - these are document features.

SVG's strength is that the browser still knows what the shapes mean.

## Canvas charts are displays

Canvas avoids the cost of maintaining thousands of DOM nodes. It can redraw dense datasets quickly because the browser is not tracking styles, layout, or event listeners for every mark.

When does this matter? Trading charts with 10,000 candles. Live telemetry streams. Dense scatter plots. Audio spectrograms. Any chart that redraws multiple times per second.

The points are visual texture, not individual semantic objects. Making every point a DOM element is wasteful.

Canvas is fast partly because it remembers less.

## What actually makes SVG slow

SVG does not become slow because it is badly designed. It becomes slow when you ask the DOM to represent too much visual detail.

A line chart with one `<path>` element containing 10,000 coordinate pairs may render fine. A scatter plot with 10,000 separate `<circle>` elements is different.

Each circle is a DOM node. The browser has to:

- Allocate memory for the node
- Track its styles and class list
- Compute its bounding box
- Maintain event listeners (even if you do not use them)
- Recalculate layout when anything changes
- Repaint on scroll, resize, or style updates

At 3,200 marks on mobile:

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Style Recalc | 380ms | 2,100ms |
| Layout | 120ms | 840ms |
| Paint | 80ms | 420ms |
| **Total blocking** | **580ms** | **3,360ms** |
| **Time to interaction** | 1.2s | 8s |

The expensive thing is not the number of rows in your dataset. It is the number of visible DOM nodes the browser has to manage.

Count marks, not rows.

Before blaming React or your state library, inspect what the chart actually renders. Open DevTools. Look at the DOM tree. If you see 5,000 `<circle>` or `<rect>` nodes, you have found the bottleneck.

## What makes Canvas annoying

Canvas gives you performance by flattening the chart into pixels. That is also what makes it a pain once the product needs interaction.

With SVG, the browser knows which element was clicked. You get `event.target`. You can attach hover states with CSS. You can write E2E tests that select specific marks.

With Canvas, you build that yourself:

- Map mouse coordinates to data coordinates
- Implement hit testing (which point is under the cursor?)
- Manage hover state manually
- Render tooltips in a separate HTML layer
- Handle keyboard navigation outside the canvas
- Maintain accessible summaries for screen readers

The moment the product manager asks for "click a data point to open the transaction details," Canvas stops feeling like a chart library and starts feeling like a graphics engine.

Canvas is not the advanced option. It is the lower-level option.

In practice:

| Feature | SVG | Canvas |
|---------|-----|--------|
| DOM nodes (5K marks) | 5,000 | 1 |
| Style recalc (mobile) | 2,100ms | 8ms |
| Per-mark interaction | Native (`event.target`) | Manual hit testing |
| Accessibility | Native ARIA | Manual overlays |
| Testability | `data-testid` works | Pixel diffing |
| Inspectable | Yes | No |
| Print-friendly | Yes | Rasterized |

Use Canvas when the density or redraw pressure justifies the lower-level work. Do not use it because the demo looked smooth.

## Common failure modes

I have debugged enough of these to recognize the patterns.

**The Starburst:** 5,000 individual SVG circles, each with a hover event, none of which the user will ever individually click. Someone said "we might need it later." Mobile users experience an 8-second freeze. Desktop users never notice. The bug sits in production for three months.

**The Steamroller:** Canvas rendering 500K points because "Canvas is faster." The eye cannot distinguish them. Most points collapse into the same pixel columns. The chart is technically accurate and completely unreadable. Nobody admits this is a visualization problem, not a performance problem.

**The Frankenstein:** Started with SVG, hit performance issues, bolted Canvas onto one series. Now there are two renderers, three tooltip systems, and a bug where the Canvas layer does not align on retina displays. The fix is "rewrite the whole thing," but nobody has time.

## A decision model

Score your chart (add points as you go):

**Mark density:**
- < 500 marks → +3 SVG
- 500-5K marks → +1 either (depends on other factors)
- \> 5K marks → +3 Canvas

**Interaction:**
- Per-mark events (hover each bar, click individual points) → +2 SVG
- Global interaction only (crosshair, zoom, brush) → +2 Canvas

**Annotations:**
- Heavy labeling, event markers, explanatory text → +2 SVG
- Just raw data, no labels → +1 Canvas

**Update frequency:**
- Static or < 1 update/sec → +1 SVG
- \> 5 updates/sec → +2 Canvas

**Context:**
- Public site, needs accessibility → +2 SVG
- Internal tool, no compliance requirements → neutral

**Result:**
- SVG score ≥ 6: use SVG
- Canvas score ≥ 6: use Canvas
- Tied or close: use hybrid pattern

## The hybrid pattern

The mature answer is often not SVG or Canvas. It is both.

Use Canvas for volume. Use SVG or HTML for meaning.

```tsx
// Canvas draws the dense time series (10,000 points)
const ctx = canvasRef.current.getContext('2d');
ctx.beginPath();
data.forEach((pt, i) => {
  const x = xScale(pt.date);
  const y = yScale(pt.value);
  if (i === 0) ctx.moveTo(x, y);
  else ctx.lineTo(x, y);
});
ctx.strokeStyle = '#3b82f6';
ctx.lineWidth = 1.5;
ctx.stroke();

// SVG for annotations and semantic markers
<svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
  <line x1={thresholdX} y1={0} x2={thresholdX} y2={height} 
        stroke="red" strokeWidth={2} strokeDasharray="5,5" />
  <text x={thresholdX + 5} y={15} fill="red">Earnings date</text>
  <circle cx={selectedX} cy={selectedY} r={5} fill="orange" />
</svg>

// HTML for tooltip
<div className="tooltip" style={{ left: tooltipX, top: tooltipY }}>
  <strong>{selectedDate}</strong>: {selectedValue}
</div>
```

This works because not every part of a chart has the same job.

The dense data layer needs throughput. The annotation layer needs structure. The tooltip needs layout. The controls need normal UI semantics.

Trying to force everything into one renderer is where charts get weird.

## Do not render what the eye cannot read

Canvas is not a license to skip data reduction.

Rendering 500,000 points on a 1,200-pixel-wide chart is not useful. Most of those points collapse into the same columns of pixels. The user cannot see the difference between 500,000 points and 1,200 well-chosen points.

At that point, the question is not "can the renderer handle it?" It is "what should the user see?"

Downsample. Aggregate. Show min/max bands. Preserve spikes if they matter. Let the user zoom into detail.

A chart can be technically accurate and visually useless.

## When the library docs lie

Library maintainers optimize for the demo, not your production edge case.

Recharts docs say it "handles large datasets efficiently." The largest example has 200 points. What they mean is "efficiently for an SVG renderer." What they do not mean is "works with 10K points." The library is fine. Your expectations are calibrated to the wrong baseline.

Chart.js says "performant." They mean "faster than Recharts for the same data." They do not mean "accessible" or "inspectable." You are trading structure for speed. Make sure you meant to make that trade.

Plotly gives you everything: interaction, hover states, exports, multiple rendering modes. It also gives you 200KB+ of minified JavaScript. For exploratory dashboards or internal tools, that trade works. For a public-facing dashboard that loads on 3G, it does not. Measure the cost before you commit.

D3 is not a chart library. It is a toolbox. You can use it with SVG, Canvas, or HTML. That makes it powerful. It also means you are responsible for more decisions. Reach for it when you need precise control or when the pre-built charts do not fit your constraints.

uPlot is fast and small for time series. It makes sense when the product is close to instrumentation: lots of points, tight interactions, low tolerance for bloat.

TradingView Lightweight Charts exists because financial charts have specific interaction patterns. Zoom, pan, crosshair, time-aligned overlays. Pretending a generic dashboard library will handle that can get painful.

The question is not "which one is best?" The question is "which renderer matches the product constraints?"

## Production checklist

Before you ship a chart:

- [ ] Open it on the slowest device you support
- [ ] Inspect the DOM tree. Count the nodes. If > 2,000, consider Canvas.
- [ ] Run Chrome Performance profiler. Look for style recalc > 500ms.
- [ ] Resize the window. Does the chart redraw smoothly?
- [ ] Test with 10x your expected data. Does it still render?
- [ ] Check bundle size. Is the chart library 40% of your JavaScript?
- [ ] Run Lighthouse. Is accessibility score < 90?
- [ ] Check on mobile. Actually check. Not "responsive mode" in DevTools.

## Rules worth keeping

Use SVG by default for dashboards, reports, and explainable charts.

Use Canvas when visible mark count, redraw frequency, or interaction smoothness makes SVG the bottleneck.

Use WebGL when Canvas is not enough and you are in large-scale visualization territory.

Count visible DOM nodes before optimizing framework code.

Do not pick a chart library from its landing page demo.

Do not use Canvas to feel serious. You may be buying performance by selling structure.

Do not use SVG for a dense instrument chart and act surprised when the DOM becomes the bottleneck.

Build a spike with realistic data before committing. Not the docs example. The worst case: the largest account, the longest time range, the slowest device you still support.

The renderer choice is not a framework preference. It is a load-bearing decision that most teams make by accident.

Before you debug React, count the marks.
