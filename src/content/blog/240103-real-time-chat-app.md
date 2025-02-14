---
author: Romain C.
pubDatetime: 2024-01-03T13:00:00Z
title: "Building a Real-Time Chat Application with WebSockets and Node.js"
featured: false
draft: false
tags:
  - nodejs
  - websockets
  - real-time
  - chat
  - javascript
description: "How to create a real-time chat application using WebSockets and Node.js"
---

## Introduction

Real-time communication is a crucial feature in modern web applications. Whether it's for chat applications, live notifications, or collaborative tools, WebSockets provide a powerful way to achieve real-time communication. Let's build a simple real-time chat application using WebSockets and Node.js.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and Node.js
- HTML and CSS
- WebSockets

## Setting Up the Project

### 1. Initialize the Project

First, create a new directory for your project and initialize a new Node.js project.

```sh
mkdir real-time-chat
cd real-time-chat
npm init -y
```

### 2. Install Dependencies

We'll need the `express` and `ws` packages to set up our server and WebSocket connections.

```sh
npm install express ws
```

## Creating the Server

### 1. Set Up Express Server

Create a file named `server.js` and set up a basic Express server.

```javascript
// filepath: /real-time-chat/server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

### 2. Create the Client

Create a `public` directory and add an `index.html` file for the client-side code.

```html
<!-- filepath: /real-time-chat/public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Real-Time Chat</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      #chat {
        max-width: 600px;
        margin: 0 auto;
      }
      #messages {
        list-style: none;
        padding: 0;
      }
      #messages li {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      #message-form {
        display: flex;
      }
      #message-form input {
        flex: 1;
        padding: 8px;
      }
      #message-form button {
        padding: 8px;
      }
    </style>
  </head>
  <body>
    <div id="chat">
      <ul id="messages"></ul>
      <form id="message-form">
        <input
          type="text"
          id="message-input"
          autocomplete="off"
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
    <script>
      const ws = new WebSocket("ws://localhost:3000");

      ws.onmessage = (event) => {
        const messages = document.getElementById("messages");
        const message = document.createElement("li");
        message.textContent = event.data;
        messages.appendChild(message);
      };

      document
        .getElementById("message-form")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const input = document.getElementById("message-input");
          ws.send(input.value);
          input.value = "";
        });
    </script>
  </body>
</html>
```

## Running the Application

Start the server by running the following command:

```sh
node server.js
```

Open your browser and navigate to `http://localhost:3000`. You should see the chat interface. Open multiple browser windows or tabs to test the real-time communication.

## Conclusion

We built a simple real-time chat application using WebSockets and Node.js. This example can be extended to include more features such as user authentication, message persistence, and more. WebSockets provide a powerful way to achieve real-time communication in web applications, and Node.js makes it easy to set up a server to handle WebSocket connections.

Happy coding!
