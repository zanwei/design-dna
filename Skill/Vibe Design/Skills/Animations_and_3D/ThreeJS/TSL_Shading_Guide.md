---
title: "Three.js TSL Shading Guide"
tags: [threejs, tsl, shaders, node-material, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/ThreeJS"
---

# ⚡ Three.js TSL Shading Guide

> **Имя скилла:** `threejs-tsl`  
> **Локальный путь:** `/root/.agent/skills/threejs/references/tsl-shading.md`  
> **Описание:** Руководство по языку шейдеров TSL и нодовым материалам.

---

# TSL (Three.js Shading Language) Reference

TSL is Three.js's node-based shading language for WebGPU and WebGL renderers, providing type-safe, composable, renderer-agnostic shader creation.

## Core Imports

```js
import { color, vec2, vec3, vec4, float, uv, time, mix, sin, cos, select, step, smoothstep, texture } from 'three/tsl';
import { MeshStandardNodeMaterial } from 'three/addons/materials/NodeMaterial.js';
```

## Basic Node Material Creation

```js
const material = new MeshStandardNodeMaterial();

// Color Node (Albedo)
const baseColor = color(0x3b82f6);
const accentColor = color(0xec4899);
const uvPattern = sin(uv().y.mul(20.0).add(time)).mul(0.5).add(0.5);

material.colorNode = mix(baseColor, accentColor, uvPattern);

// Roughness & Metalness Nodes
material.roughnessNode = float(0.2);
material.metalnessNode = float(0.9);
```

## Vertex Displacement in TSL

```js
import { positionLocal, normalLocal } from 'three/tsl';

// Elevate mesh vertices based on sine wave along normal
const displacement = sin(positionLocal.x.mul(5.0).add(time.mul(2.0))).mul(0.1);
material.positionNode = positionLocal.add(normalLocal.mul(displacement));
```

## Custom Uniforms with Dynamic Updates

```js
import { uniform } from 'three/tsl';

const myScale = uniform(1.5);
material.colorNode = color(0x00ff88).mul(myScale);

// Update uniform at runtime
myScale.value = 2.0;
```

