---
author: Romain C.
pubDatetime: 2024-01-03T13:00:00Z
title: "A Real-Time Chat in 50 Lines"
featured: false
draft: false
tags: ["nodejs", "websockets", "real-time", "chat", "javascript"]
description: "The simplest WebSocket chat server I know."
---

WebSockets sound complex until you realize a chat server is just broadcasting messages. Here's the minimal version.

## Server

```javascript
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", ws => {
  ws.on("message", message => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(3000);
```

That's it. Any message from any client goes to every connected client.

## Client

```html
<ul id="messages"></ul>
<form id="form"><input id="input" /><button>Send</button></form>
<script>
  const ws = new WebSocket("ws://localhost:3000");
  ws.onmessage = e => {
    const li = document.createElement("li");
    li.textContent = e.data;
    document.getElementById("messages").appendChild(li);
  };
  document.getElementById("form").onsubmit = e => {
    e.preventDefault();
    ws.send(document.getElementById("input").value);
    document.getElementById("input").value = "";
  };
</script>
```

## What This Doesn't Do

- Authentication: anyone can connect.
- Persistence: messages disappear when the server restarts.
- Scalability: this broadcasts in-memory. For multiple servers, you need Redis or a message broker.

But it's enough to understand how WebSockets work. Everything else is layering on top of this.
