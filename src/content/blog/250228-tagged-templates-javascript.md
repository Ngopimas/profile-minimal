---
author: Romain C.
pubDatetime: 2025-02-28T18:30:00Z
title: "Tagged Templates in JavaScript"
slug: tagged-templates-javascript
featured: false
draft: false
tags: ["javascript", "es6", "template-literals", "tagged-templates"]
description: "Tagged template literals are more powerful than they look. Here's how they work and where I use them."
---

Template literals with backticks are old news. Tagged templates—where you put a function name before the backticks—are the part most developers skip over. That's a shame, because they're genuinely useful.

## How They Work

A tagged template calls your function with two arguments: an array of string literals, and the evaluated values of each interpolation.

```javascript
function highlightValues(strings, ...values) {
  console.log(strings); // [ 'I have ', ' apples and ', ' oranges.' ]
  console.log(values);  // [ 10, 20 ]
  return "Processed result";
}

const x = 10;
const y = 20;
highlightValues`I have ${x} apples and ${y} oranges.`;
```

The function can return anything—a string, an object, a React component. styled-components uses this to turn CSS into component styles. Drizzle uses it for type-safe SQL.

## Where I Actually Use Them

**Sanitizing HTML:**

```javascript
function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = String(values[i] || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return result + str + value;
  }, "");
}

const userInput = '<script>alert("xss")</script>';
const safe = html`<div>${userInput}</div>`;
// <div>&lt;script&gt;alert("xss")&lt;/script&gt;</div>
```

**Building parameterized queries:**

```javascript
function sql(strings, ...values) {
  const query = strings.reduce((result, str, i) => {
    return result + str + (i < values.length ? `$${i + 1}` : "");
  }, "");
  return { text: query, values };
}

const query = sql`SELECT * FROM users WHERE id = ${userId}`;
// { text: 'SELECT * FROM users WHERE id = $1', values: [5] }
```

No string concatenation, no injection risk. The values stay separate from the query text.

## Raw Strings

Tagged templates can access the raw, unescaped string through `strings.raw`. Useful when you need to preserve escape sequences:

```javascript
function rawTag(strings) {
  console.log(strings.raw[0]); // "Line1\\nLine2" — the backslash is literal
}
rawTag`Line1\nLine2`;
```

## The Catch

The tag function runs every time the template is evaluated. For static templates, that's fine. For templates inside a render loop, it can add up. I usually extract the template call to a constant if the values don't change.

Tagged templates aren't a feature you'll use daily. But when you need them—for DSLs, sanitization, or query building—they're cleaner than any alternative.
