---
title: "A portfolio"
description: "A fast Astro portfolio focused on writing, project pages, search, dark mode, and clean static deployment."
pubDatetime: 2025-02-11T15:30:00Z
tags: ["astro", "typescript", "tailwind", "react"]
featured: false
type: "Portfolio system"
role: "Solo Builder"
status: "Live"
impact: "Keeps project pages, writing, search, and static deployment simple enough to maintain without hiding the work behind a heavy CMS."
url: "https://romaincoupey.com"
repository: "https://github.com/Ngopimas/profile-minimal"
ogImage: "/assets/images/project-thumbs/profile-minimal.svg"
---

A portfolio site has one job: stay out of the way.

This site is a small Astro build for project pages, writing, tags, search, dark mode, and static deployment. It is deliberately plain. The point is not to prove that a personal site can be an application. The point is to keep work readable, fast, and easy to change.

![Lighthouse Score](../../assets/images/projects/profile-minimal/lighthouse-score.svg)

## The constraint

Personal sites tend to rot because they are overbuilt.

A heavy CMS, a database, custom backend services, and complicated preview flows are usually more maintenance than the site deserves. The content changes slowly. The pages need to load quickly. The authoring path should be boring enough that publishing does not become a project by itself.

Astro fits that constraint well: content in Markdown, static output, and only a small amount of client JavaScript where the site actually needs it.

## Site shape

The site includes:

- Markdown content collections for posts and projects
- project pages with tags, descriptions, links, and visual previews
- tag and archive pages for older writing
- search for browsing content without a backend
- dark mode with user preference support
- GitHub Pages deployment on a custom domain

The implementation is intentionally easy to inspect. If a page breaks, the source is a Markdown file and a small set of Astro layouts.

## The maintenance part

The interesting work is not the first build. It is keeping the site healthy without turning it into a hobby framework.

That has meant pruning weak pages, tightening project copy, fixing link regressions after content collection changes, and keeping dependencies current enough that the static build remains boring. The site recently moved to Astro 6, which forced a cleaner content config and stricter slug handling across posts, projects, RSS, search, and generated images.

## Stack

- Astro and TypeScript
- Tailwind CSS
- React for isolated interactive components
- Markdown content collections
- GitHub Pages for deployment

## Local development

```bash
npm install
npm run dev
npm run build
```
