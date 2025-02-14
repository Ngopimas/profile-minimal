---
author: Romain C.
pubDatetime: 2023-04-17T13:00:00Z
title: "Building a CI/CD Pipeline with GitHub Actions"
featured: false
draft: false
tags:
  - github
  - ci-cd
  - devops
  - automation
description: "How to set up a CI/CD pipeline using GitHub Actions"
---

## Introduction

Continuous Integration and Continuous Deployment (CI/CD) are essential practices in modern software development. They help automate the process of testing, building, and deploying code, ensuring that your application is always in a deployable state. In this tutorial, we'll set up a CI/CD pipeline using GitHub Actions for a simple Node.js application.

## Prerequisites

To follow along, you should have a basic understanding of:

- Git and GitHub
- YAML syntax
- Basic CI/CD concepts

## Setting Up the Project

### 1. Create a New Repository

Create a new repository on GitHub for your project. You can use an existing repository if you prefer.

### 2. Clone the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 3. Add a Simple Node.js Application

For demonstration purposes, we'll use a simple Node.js application. Create a file named `index.js` with the following content:

```javascript
// filepath: ci-cd-github-actions/index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### 4. Add a Test Script

Create a file named `test.js` with a simple test script:

```javascript
// filepath: ci-cd-github-actions/test.js
const request = require("supertest");
const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

describe("GET /", () => {
  it("should return Hello, World!", (done) => {
    request(app).get("/").expect("Hello, World!", done);
  });
});
```

### 5. Add Dependencies

Create a `package.json` file and add the necessary dependencies:

```json
// filepath: ci-cd-github-actions/package.json
{
  "name": "ci-cd-github-actions",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "mocha test.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "mocha": "^8.3.2",
    "supertest": "^6.1.3"
  }
}
```

### 6. Create a GitHub Actions Workflow

Create a directory named `.github/workflows` and add a file named `ci.yml` with the following content:

```yaml
// filepath: ci-cd-github-actions/.github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "14"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

## Testing the CI/CD Pipeline

### 1. Push Changes to GitHub

Commit your changes and push them to GitHub:

```sh
git add .
git commit -m "Set up CI/CD pipeline with GitHub Actions"
git push origin main
```

### 2. Check GitHub Actions

Navigate to the "Actions" tab in your GitHub repository to see the CI/CD pipeline in action. You should see the workflow running and the tests passing.

## Conclusion

We just set up a CI/CD pipeline using GitHub Actions. This pipeline automatically tests and builds your code whenever you push changes to the main branch or create a pull request. GitHub Actions provides a powerful and flexible way to automate your development workflow, ensuring that your application is always in a deployable state.

## Additional Resources

For more information on GitHub Actions and CI/CD practices, check out the following resources:

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Continuous Integration (CI) Best Practices](https://martinfowler.com/articles/continuousIntegration.html)
- [Node.js Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices#testing-and-overall-quality)

Happy coding!
