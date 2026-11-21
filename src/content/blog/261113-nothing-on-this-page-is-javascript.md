---
author: Romain C.
pubDatetime: 2026-11-13T10:00:00Z
title: "Nothing on this page is JavaScript"
slug: nothing-on-this-page-is-javascript
featured: false
draft: false
tags: ["css", "html", "view-transitions", "web development"]
description: "NOSCRIPT is a six-page zine with a 3D combination lock, a scroll-turned drum and animated page turns, and no script element. Notes on what CSS took over from JavaScript, and what it still cannot do."
---

In July I wrote [Nothing on this page is a video](/posts/nothing-on-this-page-is-a-video/), about a page where every frame was computed by a shader. This is the opposite experiment. [NOSCRIPT](/noscript/index.html) is a small zine of six HTML documents and one stylesheet. It has a pile of sheets stacked in three dimensions, a drum that turns as you read, a combination lock, menus that climb out of the boxes that clip them, and pages that turn when you follow a link. It has no `<script>`, no canvas and no event handler.

<div style="position: relative; height: 420px; overflow: hidden; border-radius: 8px; margin: 1.5rem 0;">
  <iframe src="/noscript/index.html" title="NOSCRIPT, a zine with no JavaScript. Open the full page for the real thing."
    loading="lazy" aria-hidden="true" tabindex="-1"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 200%; border: 0; pointer-events: none;"></iframe>
  <a href="/noscript/index.html" style="position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 1rem; color: white; text-decoration: none; font-weight: 500; background: linear-gradient(transparent 70%, rgba(13,12,20,0.85));">
    Open NOSCRIPT in a new tab &rarr;
  </a>
</div>

Each page takes one job the web used to hand to JavaScript, shows the code we wrote for it, and then does the job in front of you without it. The listener, the click handler, the overlay, the loop, the router.

## Checking the claim

A title like that should be cheap to verify, so each page carries two proofs. The first is a Content-Security-Policy that forbids scripts outright:

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'none'" />
```

The second is in the footer. It says "0 scripts", and the stylesheet strikes that out if it ever stops being true:

```css
:root:has(script) .proof .count {
  text-decoration: line-through var(--red) 0.15em;
}
```

A browser extension that injects a script element will trip it. The footer says so, which seemed fairer than pretending the test is airtight. Otherwise, view source. The whole zine is about 135 KB and none of it is minified.

## A lock made of radio buttons

The page about click handlers has a three-dial combination lock. Each dial is ten radio buttons standing on a drum built with 3D transforms, thirty inputs in all. You can turn it with the arrow keys. Dial 2-0-0 and a hinged door swings open.

Nothing in it is computed in the usual sense. A checked radio turns its drum to the matching angle with `:has()`. It also adds its digit to a CSS counter, and the counter is what prints the code you dialled:

```css
.dial-a :checked {
  counter-increment: a var(--i);
}
.status::before {
  content: counter(a) counter(b) counter(c) " ";
}
.lock:has(#a2:checked):has(#b0:checked):has(#c0:checked) .status::after {
  content: "OK";
}
```

The lock reads its three digits as an HTTP status code and knows about a dozen of them by name. 404 says "Not Found". 418 says "I'm a teapot". Anything else gets "Not a status I know", which is honest about the trick: every answer is a selector somebody wrote by hand.

I think this is the page that makes the argument best. Most interface code was never logic. It was a handler whose whole job was to put a class on some other element, and the state it tracked was already in the document. The radio button knew it was checked. `:has()` lets a different element find out.

## Numbers without a loop

CSS has no way to print the value of a custom property, and that sounds like the end of any readout. It can print a counter, though, and a counter can be set from a registered custom property. So the reading progress bar on the listener page animates a number on a scroll timeline and hands it to a counter:

```css
.progress {
  animation: read linear both;
  animation-timeline: scroll(root block);
  counter-reset: pct var(--pct);
}
.progress::after {
  content: counter(pct) "%";
}
```

The same move prints the drum's angle in degrees, and on another page the viewport's width in pixels and the number of characters that fit on a line.

The page about loops has three rings of tiles, 5, 8 and 13 of them, standing in 3D. One rule places all three. Each tile asks where it is among its siblings and how many there are, and works out its own angle and its distance from the axis:

```css
.ring > li {
  --i: sibling-index();
  --n: sibling-count();
  --step: calc(360deg / var(--n));
  --r: calc(1.65rem / tan(180deg / var(--n)));
}
```

Add a fourteenth tile in the HTML and the ring closes around it. The template loop that used to write `style="--i: 7"` on every element has nothing left to do.

## The router is one rule

Following a link in the zine turns the page. The old document swings away on its left edge, the wordmark stays where it is, and the sheet you picked from the cover pile travels into place as the title plate of its chapter. For about ten years the price of that effect was a single-page app. Here it is this:

```css
@view-transition {
  navigation: auto;
}
.stack li:nth-child(2) .face,
.p-state .plate {
  view-transition-name: plate-2;
}
```

Both documents opt in, and two elements on two different pages share a name. The browser does the rest, and the back button, scroll position and focus keep working because these are real navigations. A browser that does not know the rule skips it and loads the next page the ordinary way.

## Where CSS made me cheat

There is no `@supports` test for cross-document view transitions. The cover has a support table whose last column is filled in by your own browser, and on that one row it has to shrug.

CSS cannot ask whether the browser understands an HTML attribute either. The modal on the overlay page opens with an invoker command, `command="show-modal"`, and a button like that does nothing where commands are missing. So the page carries two openers and shows one. The test that picks between them is a stand-in: `@supports (order: sibling-index())`. Every engine shipped `sibling-index()` after invoker commands or in the same release, so if the function exists, the command is safe. Everyone else gets a plain link to `#modal` and a dialog that shows itself while it is the `:target`. That fallback is an overlay, not a modal. The page behind stays live and Escape does nothing, and the dialog's own text says so.

The cover pile needed two elements per sheet. A sheet that lifts on hover can move out from under the pointer, drop, and get hovered again. So each one is split: a link that stays still and takes the pointer, and a paper face that lifts and ignores it.

Pages always turn forward. A stylesheet has no way to know that you pressed "previous".

## What it still cannot do

The cover has a list with this title, and I would rather repeat it here than let the headline oversell. The zine cannot remember anything: state lives in form controls and in the URL, so the lock forgets your code when you turn the page. It cannot read a value, only whether a box is checked, which is why there is no slider anywhere in it. And it cannot talk to a server. Links and forms are still the only requests a document makes by itself.

Those are large gaps. Anything with data in it still needs a script.

## What you can use on Monday

This is where NOSCRIPT differs from the shader pages, which I said plainly do not belong on a normal site. Most of this one does. According to [MDN's compatibility data](https://developer.mozilla.org/en-US/docs/Web/CSS) on the day I wrote this, `:has()`, popovers, anchor positioning, `@starting-style`, exclusive `<details>` and scroll-driven animations are in the current release of all three engines.

The rest is uneven. Scroll-state queries and the generated carousel controls are Chromium only. Cross-document transitions run in Chrome and Safari, and Firefox still has them behind a preference. `random()`, which the loop page uses to print a two-ink plate slightly out of register, reached Chrome in version 156 and has not reached a Firefox release yet. Every one of these sits behind `@supports` in the stylesheet, and the fallback is the same each time: the content, laid flat, with working links.

How much of the zine you get therefore depends on your browser. [Open the cover](/noscript/index.html) and read the last column of the support table; your browser fills it in.
