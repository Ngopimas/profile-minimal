---
author: Romain C.
pubDatetime: 2023-10-03T10:30:00Z
title: "WebAssembly: Supercharging Web Performance"
slug: webassembly-web-performance
featured: false
draft: false
tags:
  [
    "webassembly",
    "performance",
    "javascript",
    "optimization",
    "web-development",
  ]
description: "What WebAssembly is actually good for, and what it is not"
---

JavaScript engines are fast, but they are still interpreters. For some tasks, that is the bottleneck. WebAssembly lets you run compiled code in the browser at close to native speed. It is not a replacement for JavaScript. It is a complement for the parts that need it.

## What it actually is

WebAssembly is a binary format for a stack-based virtual machine. You write code in C, C++, Rust, or Go, compile it to a `.wasm` file, and load it from JavaScript. The browser runs it in the same sandbox as JS, with the same security model.

```rust
// Example Rust code that compiles to WebAssembly
pub fn fibonacci(n: i32) -> i32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2)
    }
}
```

## Where it helps

The places I have seen real gains are computation-heavy work: image processing, physics simulation, video encoding, and complex math. DOM manipulation is not one of them. If your bottleneck is React re-renders or API latency, WebAssembly will not help.

```javascript
// JavaScript code interfacing with Wasm module
async function processImage(imageData) {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch("image-processor.wasm")
  );
  return wasmModule.instance.exports.processImage(imageData);
}
```

Game engines like Unity and Unreal can compile to WebAssembly, which is why browser-based demos that would have been impossible five years ago now run at acceptable frame rates.

## The overhead people forget

Calling from JavaScript into Wasm and back is not free. Every boundary crossing has marshalling cost. If you are calling a Wasm function in a tight loop from JS, you might lose the speedup just from the overhead. The best results come from moving an entire computation into Wasm and returning the final result, not ping-ponging back and forth.

Memory is another gotcha. Wasm uses linear memory, which is just a big array buffer shared between JS and Wasm. If your Rust code leaks, or if you pass pointers around incorrectly, you get crashes that look like segfaults. The sandbox prevents them from escaping the browser, but debugging them is still painful.

## Getting started

Rust with `wasm-pack` is the smoothest path I have found. Install it, write your Rust code, run `wasm-pack build --target web`, and you get a package you can import like any npm module.

```bash
cargo install wasm-pack
wasm-pack build --target web
```

For simpler cases, AssemblyScript gives you a TypeScript-like syntax that compiles directly to Wasm. It is less powerful than Rust, but the learning curve is much gentler.

## When to use it

I would reach for WebAssembly when:

- I have a compute bottleneck that profiling confirms is in JS
- I am porting existing C/C++/Rust code to the web
- I need predictable performance without GC pauses

I would not reach for it when:

- The bottleneck is network or DOM
- The codebase is small enough that JS is already fast enough
- The team does not know a systems language

It is a useful tool. It is not a magic bullet.
