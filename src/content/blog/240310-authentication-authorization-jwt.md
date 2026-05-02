---
author: Romain C.
pubDatetime: 2024-03-10T13:00:00Z
title: "Implementing Authentication and Authorization in Node.js with JWT"
featured: false
draft: false
tags: ["nodejs", "jwt", "authentication", "authorization", "api"]
description: "A minimal JWT setup in Node.js that covers the basics without over-engineering"
---

JWT is just a signed JSON payload. You create it on login, send it back to the client, and the client includes it in every subsequent request. The server verifies the signature and trusts the claims inside. That is it. Everything else is implementation detail.

I have seen teams over-engineer this with refresh token rotations, complex permission matrices, and opaque token formats. For most projects, a simple access token with a reasonable expiry is enough.

## A minimal setup

Create a new project and install the dependencies:

```sh
mkdir auth-api
cd auth-api
npm init -y
npm install express jsonwebtoken bcryptjs
```

Here is the server I usually start with:

```javascript
// filepath: /auth-api/server.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const users = [];

const secretKey = "your-secret-key";

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
  res.json({ token });
});

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

That is the whole thing. Register, login, and a protected route. In production you would swap the in-memory `users` array for a database, move the secret key to an environment variable, and probably add rate limiting. But the core mechanism is the same.

## Testing it

I usually test with `curl` rather than Postman. Register a user:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"secret"}'
```

Log in to get a token:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"secret"}'
```

Use the token on a protected route:

```bash
curl http://localhost:3000/protected \
  -H "Authorization: Bearer <your-token>"
```

If you are building a real API, you will want role-based access control, token refresh, and maybe OAuth for social login. But start simple. JWT is easy to get wrong when you add complexity too early.
