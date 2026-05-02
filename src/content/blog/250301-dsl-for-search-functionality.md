---
author: Romain C.
pubDatetime: 2025-03-01T09:00:00Z
title: "Building Domain-Specific Languages for Search Functionality"
slug: dsl-for-search-functionality
featured: false
draft: false
tags: ["javascript", "dsl", "search", "developer-experience", "user-experience"]
description: "Creating intuitive search interfaces that empower users while maintaining developer control"
---

I spend way too much time in GitHub's search bar. Not because I'm good at it, but because their query syntax is one of the few search DSLs that actually feels like it was built by humans for humans. `stars:>1000 language:typescript` just makes sense. You don't need a manual to guess how it works.

That intuitiveness is rare. Most search boxes either give you a single text input and hope for the best, or they dump a dozen filter dropdowns on you that feel like a tax form. A well-designed search DSL sits in the middle: powerful enough for advanced users, invisible to everyone else.

The basic building blocks are pretty standard. Field filters like `status:open`, operators like `price:>50`, and boolean logic with `AND`/`OR`. Gmail does this well too - `from:boss@company.com has:attachment` reads like a sentence. The trick isn't the grammar; it's picking field names that match how your users already talk about the data.

I built a lightweight parser for a project last month. No fancy libraries, just a tokenizer that walks the string, respects quoted phrases, and splits on colons and spaces. It returns a simple object with text searches and filters. Here's the gist:

```javascript
function parseSearchQuery(queryString) {
  const tokens = [];
  let current = "";
  let inQuotes = false;

  for (const char of queryString) {
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === " " && !inQuotes) {
      if (current) tokens.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);

  const query = { textSearch: [], filters: [] };
  for (const token of tokens) {
    if (token.includes(":")) {
      const [field, value] = token.split(":");
      query.filters.push({ field, value });
    } else {
      query.textSearch.push(token);
    }
  }
  return query;
}
```

For anything heavier, I reach for a proper lexer and AST. Tokenize first, parse into a tree, then compile to whatever the backend needs - SQL, MongoDB, Elasticsearch, whatever. Keeping those stages separate has saved me every time the client asks for "one more operator" three days before launch.

Security matters here. Users will type wild stuff. I always validate field names against a whitelist, cap query complexity, and parameterize everything before it hits the database. A search box is an injection vector like any other input.

If you're designing one of these, my advice is: steal from GitHub and Gmail. Their patterns are battle-tested. And for the love of all that is holy, add autocomplete. Nothing makes a DSL feel friendlier than suggesting `is:open` before the user finishes typing `op`.
