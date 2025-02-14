---
author: Romain C.
pubDatetime: 2024-03-10T13:00:00Z
title: "Implementing Authentication and Authorization in Node.js with JWT"
featured: false
draft: false
tags:
  - nodejs
  - jwt
  - authentication
  - authorization
  - api
description: "How to implement authentication and authorization in a RESTful API using JWT"
---

## Introduction

Authentication and authorization are critical components of any secure web application. JSON Web Tokens (JWT) is a popular way to handle authentication and authorization in a RESTful API. Let's implement it in a Node.js project.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and Node.js
- Express.js
- JWT (JSON Web Tokens)

## Setting Up the Project

### 1. Initialize the Project

First, create a new directory for your project and initialize a new Node.js project.

```sh
mkdir auth-api
cd auth-api
npm init -y
```

### 2. Install Dependencies

We'll need the `express`, `jsonwebtoken`, and `bcryptjs` packages to set up our server, handle JWTs, and hash passwords.

```sh
npm install express jsonwebtoken bcryptjs
```

## Creating the Server

### 1. Set Up Express Server

Create a file named `server.js` and set up a basic Express server.

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
  const user = users.find((u) => u.username === username);
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

## Testing the API

### 1. Register a User

Use a tool like Postman to send a POST request to `http://localhost:3000/register` with the following JSON body:

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 2. Log In

Send a POST request to `http://localhost:3000/login` with the following JSON body:

```json
{
  "username": "testuser",
  "password": "password123"
}
```

You should receive a JWT token in the response.

### 3. Access Protected Route

Send a GET request to `http://localhost:3000/protected` with the `Authorization` header set to `Bearer <your-token>`.

## Conclusion

We just implemented basic authentication and authorization in a Node.js RESTful API using JWT. This example can be extended to include more features such as role-based access control, token refresh, and more.

Happy coding!
