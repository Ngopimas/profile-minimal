---
title: "EMILI 3D Visualization Platform"
description: "A web-based 3D visualization platform for Imerys' lithium mining project, enabling public engagement through interactive exploration of mining sites and facilities."
pubDatetime: 2024-03-11T15:30:00Z
tags: ["threejs", "mapbox", "javascript"]
featured: true
url: "https://emili3d.imerys.com"
---

I developed a web-based 3D visualization platform for the EMILI lithium mining project by Imerys, enabling stakeholders to explore and understand the environmental and infrastructural aspects of this significant initiative in the Allier region of France. The platform serves as a crucial tool for the public debate scheduled from March to July 2024.

[Learn more about the EMILI project](https://emili.imerys.com/)

[Public debate details](https://www.debatpublic.fr/mine-de-lithium-allier/le-dossier-du-maitre-douvrage-5411)

## Proof of Concept Video

<video controls>
  <source src="/assets/video/emili.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Project Overview

The EMILI project represents a significant step in European industrial sovereignty, aiming to produce 34,000 tonnes of lithium hydroxide annually by 2028. My role involved creating an interactive 3D visualization platform to help stakeholders understand the project's scope and impact:

- The mineral extraction site and known mineral envelope
- The concentration plant facilities
- The transportation platform
- The conversion plant

All components are geolocated and positioned on the actual site topography, overlaid with satellite imagery.

## Technical Achievements

### Interactive 3D Visualization

- **High-Performance Rendering**: Implemented efficient 3D rendering using Three.js and WebGL
- **Dynamic Asset Management**: Developed a progressive loading system for 3D models (OBJ, GLTF) and textures
- **Responsive Interface**: Created a fluid interface that adapts to various devices
- **Intuitive Navigation**: Implemented user-friendly controls for 3D exploration

### Geospatial Integration

- **Georeferencing**: Integrated DXF topographic maps for accurate positioning
- **Terrain Visualization**: Implemented detailed terrain rendering using real topographic data
- **High-Resolution Imagery**: Incorporated TIFF satellite imagery for environmental context
- **Interactive Layers**: Developed a system for toggling different project components

## Technical Implementation

### Core Technologies

- **Three.js**: Utilized for 3D rendering and scene management
- **Mapbox**: Integrated for GIS data visualization
- **React**: Implemented for the user interface and state management

### Key Features

- **Multi-scale Visualization**: Implemented seamless navigation from regional to local views
- **Layer Management**: Created an intuitive system for managing visualization layers
- **Performance Optimization**: Developed level-of-detail systems and asset streaming
- **Cross-browser Compatibility**: Ensured consistent experience across modern browsers

## Impact and Results

- **Public Engagement**: Facilitated understanding of the project's scope and impact
- **Accessibility**: Provided browser-based access to complex project information
- **Technical Excellence**: Achieved smooth performance with complex 3D data
- **User Experience**: Created an intuitive interface for non-technical users

## Future Developments

Planned enhancements include:

- Additional environmental impact visualization layers
- Enhanced mobile device optimizations
- Project progress visualization features
- Offline mode for remote areas

## Technical Challenges Overcome

- **Large Dataset Management**: Implemented efficient streaming and caching
- **Cross-Platform Compatibility**: Ensured consistent experience across devices
- **Performance Optimization**: Balanced visual quality with performance
- **Intuitive Controls**: Simplified complex 3D navigation for public users
