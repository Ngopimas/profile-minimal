---
author: Romain C.
pubDatetime: 2023-12-10T13:00:00Z
title: "Building a Progressive Web App (PWA) with React"
featured: false
draft: false
tags:
  - react
  - pwa
  - progressive-web-app
  - javascript
description: "How to build a Progressive Web App (PWA) using React"
---

## Introduction

Progressive Web Apps (PWAs) provide a native app-like experience on the web. They offer features such as offline support, push notifications, and fast loading times. Let's build a simple PWA using React.

## Prerequisites

To follow along, you should have a basic understanding of:

- JavaScript and React
- Service Workers
- Web App Manifest

## Setting Up the Project

### 1. Create a New React App

Create a new React app using Create React App with the PWA template.

```sh
npx create-react-app pwa-react --template cra-template-pwa
cd pwa-react
```

### 2. Understanding the PWA Template

The PWA template provided by Create React App includes a service worker and a web app manifest. Let's take a look at these files.

#### Service Worker

The service worker is located in `src/service-worker.js`. It handles caching and offline support.

```javascript
// filepath: pwa-react/src/service-worker.js
// ...CRA generated code...
```

#### Web App Manifest

The web app manifest is located in `public/manifest.json`. It defines the metadata for your PWA.

```json
// filepath: pwa-react/public/manifest.json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### 3. Customizing the PWA

Customize the PWA by updating the manifest and adding a custom service worker.

#### Update the Manifest

Update the `public/manifest.json` file with your app's details.

```json
// filepath: pwa-react/public/manifest.json
{
  "short_name": "PWA React",
  "name": "PWA React App",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0000ff",
  "background_color": "#ffffff"
}
```

#### Add a Custom Service Worker

Create a file named `custom-service-worker.js` and add custom caching logic.

```javascript
// filepath: pwa-react/src/custom-service-worker.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pwa-react-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/static/js/bundle.js",
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/static/css/main.chunk.css",
        "/logo192.png",
        "/logo512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 4. Register the Custom Service Worker

Update the `src/index.js` file to register the custom service worker.

```javascript
// filepath: pwa-react/src/index.js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./custom-service-worker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
});
```

### 5. Build and Deploy the PWA

Build the PWA for production.

```sh
npm run build
```

Deploy the `build` directory to a static hosting service such as Netlify, Vercel, or GitHub Pages.

## Conclusion

We built a simple Progressive Web App (PWA) using React. We used the PWA template provided by Create React App, customized the web app manifest, and added a custom service worker. PWAs provide a native app-like experience on the web, offering features such as offline support and push notifications.

Happy coding!
