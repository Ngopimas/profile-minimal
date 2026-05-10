---
title: "EMILI 3D Visualization Platform"
description: "A browser-based 3D platform for Imerys' lithium mining project, built to make site infrastructure easier to explore during public debate."
pubDatetime: 2024-03-11T15:30:00Z
tags: ["threejs", "mapbox", "javascript"]
featured: true
url: "https://emili3d.imerys.com"
ogImage: "/assets/images/project-thumbs/emili.jpg"
---

At DeepLime, I built a web-based 3D visualization platform for the EMILI lithium mining project by Imerys.

The platform lets visitors explore the project in the browser: extraction site, concentration plant, transport platform, conversion plant, and surrounding terrain. It was designed for public communication, so the interface had to make industrial infrastructure understandable without requiring technical knowledge.

![EMILI 3D Visualization Platform](../../assets/images/emili.png)

## What I built

- A browser-based 3D scene using Three.js and WebGL
- Geolocated project components placed on real site topography
- Satellite imagery and terrain context through Mapbox
- Layer controls for exploring different parts of the project
- A responsive interface usable by non-technical visitors

## First POC video

<video controls>
  <source src="/assets/video/emili.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## The hard parts

The project needed to balance technical accuracy with public readability. Too much detail and the scene becomes unusable. Too little and it stops being useful for explaining the project.

The other challenge was performance. 3D models, terrain, and geospatial context can get heavy quickly, especially in a browser. I had to keep the scene fluid while preserving enough context for visitors to understand what they were looking at.

## What this shows recruiters

- 3D web development with real constraints, not a decorative Three.js demo
- Geospatial thinking with terrain, satellite imagery, and site positioning
- Product judgment for public-facing industrial communication
- Performance awareness in browser-based visualization
- Ability to ship work for a high-visibility client context

## Stack

- Three.js and WebGL
- Mapbox for geospatial context
- JavaScript and Vite
- Georeferenced 3D and topographic data

Further information:

- [Learn more about the EMILI project](https://emili.imerys.com/)
- [Public debate details](https://www.debatpublic.fr/mine-de-lithium-allier/le-dossier-du-maitre-douvrage-5411)
- [Visit the current EMILI 3D platform](https://emili3d.imerys.com)

<iframe src="https://emili3d.imerys.com" title="EMILI 3D Platform Demo" width="100%" height="400" allowfullscreen></iframe>
