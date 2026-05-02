---
author: Romain C.
pubDatetime: 2023-12-10T13:00:00Z
title: "Building a Progressive Web App (PWA) with React"
featured: false
draft: false
tags: ["react", "pwa", "progressive-web-app", "javascript"]
description: "A minimal PWA setup with React and a custom service worker"
---

PWAs are just websites with a few extra files. A service worker for offline support, a manifest for the home screen icon, and a secure origin. The rest is your normal React app.

I usually start with Create React App's PWA template to get the boilerplate, then rip out what I do not need and add my own caching logic.

```sh
npx create-react-app pwa-react --template cra-template-pwa
cd pwa-react
```

The template gives you a `service-worker.js` and a `manifest.json`. I almost always replace the service worker with something simpler. The default caches everything aggressively, which is fine for a demo but causes stale content issues in production.

Here is the custom service worker I usually drop in:

```javascript
// filepath: pwa-react/src/custom-service-worker.js
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("pwa-react-cache").then(cache => {
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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

Then I register it in `index.js`:

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
  onUpdate: registration => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
});
```

The manifest is straightforward. Update the name, icons, and theme colors:

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

Build and deploy the `build` folder to any static host. Netlify, Vercel, GitHub Pages, whatever you prefer. The PWA part works as long as the origin is HTTPS and the manifest and service worker are served at the root.
