---
author: Romain C.
pubDatetime: 2025-02-28T18:30:00Z
title: "Tagged Templates in JavaScript"
slug: tagged-templates-javascript
featured: false
draft: false
tags: ["javascript", "es6", "template-literals", "tagged-templates"]
description: "From basic string manipulation to building type-safe SQL queries and domain-specific languages"
---

JavaScript's ES6 introduced template literals, which revolutionized string handling with features like multiline strings and string interpolation. However, one of the most powerful yet underutilized features of template literals is **tagged templates**. This powerful mechanism allows you to process template literals with a function, opening up a world of possibilities for creating domain-specific languages (DSLs) and custom string processors.

## Understanding Template Literals

Before diving into tagged templates, let's quickly review template literals. Template literals are string literals that allow embedded expressions and multiline strings, using backticks (`` ` ``) instead of quotes.

```javascript
const name = "JavaScript";
const greeting = `Hello, ${name}!`;
console.log(greeting); // Outputs: Hello, JavaScript!

// Multiline strings
const multiline = `This is a
multiline string
in JavaScript`;
```

While these features alone are fantastic improvements over traditional strings, tagged templates take them to another level.

## What Are Tagged Templates?

A tagged template is essentially a function call where the arguments are derived from a template literal. The tag (function) processes the template's literal sections and expressions, giving you complete control over how the template is evaluated.

The basic syntax looks like this:

```javascript
tagFunction`string text ${expression} string text`;
```

In this example, `tagFunction` is called with the processed content of the template literal. No parentheses are needed - it's a special syntax in JavaScript.

## How Tagged Templates Work

When you use a tagged template, the tag function receives:

1. An array of string literals (the parts between expressions)
2. The evaluated values of each interpolated expression

For example:

```javascript
function highlightValues(strings, ...values) {
  console.log("String parts:", strings);
  console.log("Values:", values);

  // You can return any value, not just a string
  return "Processed result";
}

const x = 10;
const y = 20;
const result = highlightValues`I have ${x} apples and ${y} oranges.`;
console.log(result);

// Output:
// String parts: [ 'I have ', ' apples and ', ' oranges.' ]
// Values: [ 10, 20 ]
// Processed result
```

Notice how the function receives the static parts of the string as an array, and each interpolated value as a separate argument.

## Practical Use Cases for Tagged Templates

### 1. Sanitizing User Input

Tagged templates can help prevent XSS attacks by automatically escaping potentially dangerous input:

```javascript
function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] || "";
    // Replace potentially harmful characters
    const safeValue = String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    return result + str + safeValue;
  }, "");
}

const userName = '<script>alert("XSS")</script>';
const safeHtml = html`<div>Hello, ${userName}!</div>`;
console.log(safeHtml);
// Output: <div>Hello, &lt;script&gt;alert("XSS")&lt;/script&gt;!</div>
```

### 2. Styled Components in React

Libraries like styled-components use tagged templates to define CSS styles for React components:

```javascript
import styled from "styled-components";

const Button = styled.button`
  background-color: ${props => (props.primary ? "blue" : "gray")};
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
`;

// Usage
<Button primary>Click Me</Button>;
```

### 3. Internationalization (i18n)

Tagged templates can simplify internationalization by providing contextual translations:

```javascript
function i18n(strings, ...values) {
  const locale = "fr"; // Could be determined dynamically

  // Simplified translation lookup
  const translations = {
    en: {
      Hello: "Hello",
      "Welcome to": "Welcome to",
    },
    fr: {
      Hello: "Bonjour",
      "Welcome to": "Bienvenue sur",
    },
  };

  // Translate each string part
  const translatedStrings = strings.map(
    str => translations[locale][str.trim()] || str
  );

  // Recombine with values
  return translatedStrings.reduce(
    (result, str, i) => result + str + (values[i] || ""),
    ""
  );
}

const site = "romaincoupey.com";
console.log(i18n`Hello, ${userName}! Welcome to ${site}.`);
// Output: Bonjour, John! Bienvenue sur romaincoupey.com.
```

### 4. SQL Query Building with Protection Against Injection

Modern ORMs like Drizzle leverage tagged templates to provide type-safe SQL query building capabilities:

```javascript
function sql(strings, ...values) {
  // Create placeholders for prepared statements
  const query = strings.reduce((result, str, i) => {
    return result + str + (i < values.length ? `$${i + 1}` : "");
  }, "");

  return {
    text: query,
    values: values,
  };
}

const userId = 5;
const status = "active";
const query = sql`
  SELECT * FROM users
  WHERE id = ${userId}
  AND status = ${status}
`;

console.log(query);
// Output: {
//   text: 'SELECT * FROM users WHERE id = $1 AND status = $2',
//   values: [5, 'active']
// }
```

## Advanced Techniques with Tagged Templates

### Raw Strings

Tagged template functions can access the raw, unprocessed strings through the special `.raw` property of the first argument:

```javascript
function rawTag(strings, ...values) {
  console.log("Cooked:", strings[0]);
  console.log("Raw:", strings.raw[0]);
  return "Result";
}

rawTag`Line1\nLine2`;
// Output:
// Cooked: Line1
// Line2
// Raw: Line1\nLine2
```

This is particularly useful when you need to preserve escape sequences.

### Custom DSLs (Domain-Specific Languages)

Tagged templates are perfect for creating mini-languages within JavaScript:

```javascript
function css(strings, ...values) {
  const styles = strings.reduce((result, str, i) => {
    return result + str + (values[i] || "");
  }, "");

  // Parse the CSS-like syntax and convert to JavaScript object
  const rules = styles
    .split(";")
    .filter(rule => rule.trim())
    .map(rule => {
      const [property, value] = rule.split(":").map(part => part.trim());
      return { [property]: value };
    })
    .reduce((obj, rule) => ({ ...obj, ...rule }), {});

  return rules;
}

const primaryColor = "blue";
const styles = css`
  color: white;
  background-color: ${primaryColor};
  font-size: 14px;
`;

console.log(styles);
// Output: { color: 'white', backgroundColor: 'blue', fontSize: '14px' }
```

## Performance Considerations

Tagged templates are evaluated once when they're defined, making them more efficient than regular string concatenation in some cases. However, there are a few things to keep in mind:

1. The tag function is called every time the template is encountered in the code execution
2. For static templates, consider memoizing the results
3. Complex operations in tag functions can impact performance

## Browser Compatibility

Tagged templates are supported in all modern browsers and Node.js environments. They're part of the ES6 (ES2015) specification, which has widespread support. For older browsers, you'll need to use a transpiler like Babel.

## Conclusion

Tagged templates are a powerful feature that extends JavaScript's capabilities beyond simple string manipulation. They enable elegant solutions for many common programming challenges, from sanitization to internationalization, and provide a foundation for creating expressive, safe, and maintainable code.

By mastering tagged templates, you add a versatile tool to your JavaScript toolbox that can make your code more concise, more readable, and more powerful. Next time you find yourself wrestling with complex string manipulation or designing a new API, consider whether a tagged template might be the elegant solution you're looking for.

## Further Reading

- [MDN Web Docs: Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [Exploring JS: Tagged templates](https://exploringjs.com/es6/ch_template-literals.html#sec_tagged-templates)
- [styled-components documentation](https://styled-components.com/docs/basics#tagged-template-literals)
- [Drizzle ORM SQL Template Documentation](https://orm.drizzle.team/docs/sql)
