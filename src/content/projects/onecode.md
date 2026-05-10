---
title: "OneCode Cloud"
description: "A cloud platform for deploying Python applications from the OneCode ecosystem, built with Next.js, AWS serverless services, and a secure workspace model."
pubDatetime: 2024-07-11T15:30:00Z
tags: ["nextjs", "aws", "typescript", "python", "serverless"]
featured: true
url: "https://www.onecode.rocks"
repository: "https://github.com/deeplime-io/onecode"
ogImage: "/assets/images/project-thumbs/onecode-cloud.jpg"
---

I led the development of OneCode Cloud at DeepLime: a web platform that lets teams deploy Python applications without setting up cloud infrastructure by hand.

The product sits on top of the open source OneCode ecosystem. The goal was practical: let data science teams package a Python workflow, deploy it, share it with business users, and manage it from a web interface.

![OneCode Cloud preview](../../assets/images/project-thumbs/onecode-cloud-preview.png)

## What I built

- A Next.js and TypeScript application for deployment management
- Workspace and project flows for organizing Python apps
- AWS serverless execution paths for running deployed applications
- Authentication and authorization workflows with AWS Cognito
- File storage and deployment artifacts through S3
- CI/CD and testing conventions for a production web app

## The hard parts

The product had to hide cloud complexity without pretending it did not exist. Users needed a simple deployment flow, but the system still had to handle isolation, permissions, execution limits, logs, and failure states.

That pushed the architecture toward workspace boundaries and least privilege access. Each app needed its own execution context, and the UI had to make technical states understandable to users who were not cloud engineers.

## What this shows recruiters

- Full stack ownership across frontend, backend, auth, storage, and deployment workflows
- Strong TypeScript and Next.js implementation on a real product, not a demo
- Cloud architecture judgment, especially around AWS Lambda, S3, Cognito, and PostgreSQL
- Ability to turn a technical library into a usable product surface
- Communication with both technical users and business stakeholders

## Stack

- Next.js, React, TypeScript, Tailwind CSS
- AWS Lambda, S3, Cognito, PostgreSQL
- GitHub Actions for automated testing and deployment
- OneCode Python library as the execution ecosystem

Related links:

- [OneCode Cloud Platform](https://www.onecode.rocks)
- [OneCode GitHub repository](https://github.com/deeplime-io/onecode)
- [DeepLime](https://www.deeplime.io)
