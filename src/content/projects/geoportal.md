---
title: "GeoPortal by DeepLime"
description: "A cloud data science platform for geoscientists, focused on workflow automation, resource estimation, and geological visualization."
pubDatetime: 2023-02-11T15:30:00Z
tags: ["react", "cloud", "data-science", "python", "automation"]
featured: true
url: "https://deeplime.io/products#geoportal"
ogImage: "/assets/images/project-thumbs/geoportal.jpg"
---

Geoscience software has a translation problem.

The data is spatial, heavy, and domain specific. The workflows often live in specialist desktop tools or Python scripts. GeoPortal brought part of that work into a cloud platform, so geoscientists and mining teams could run processing workflows, visualize results, and share outputs without forcing every user into the same local setup.

![GeoPortal](../../assets/images/geoportal.jpg)

## The constraint

A generic dashboard is not enough for geological work.

Users need spatial context, processing state, data lineage, and outputs that still make sense to domain experts. A chart that ignores the underlying geology is just decoration. A workflow runner that hides too much state is hard to trust when the result affects resource estimation or operational decisions.

The product had to simplify the surface without flattening the domain.

## Product shape

The platform work included:

- dashboards for monitoring data processing workflows
- 2D and 3D geological visualization interfaces
- integration between the web app and Python processing tools
- GIS and spatial data workflows
- client-specific customization for mining and geoscience teams

The important part was the bridge between web product and technical computation. The UI needed to show enough process state for users to understand where an output came from.

## The hard part

Different clients rarely have the same geological workflow.

That makes product design awkward. Too much customization creates a maintenance burden. Too little flexibility makes the platform unusable for real projects. The architecture had to leave room for client-specific setups while keeping the core interaction model consistent.

Working close to domain experts mattered more than guessing from the outside. The useful interface decisions came from the details: file formats, coordinate systems, processing steps, and how teams review results.

## Stack

- React and Redux for the web interface
- AWS and Azure depending on client context
- Node.js backend services
- Python for geological data processing
- GIS and spatial data tooling
