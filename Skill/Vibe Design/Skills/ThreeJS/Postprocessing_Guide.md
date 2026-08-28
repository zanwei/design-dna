---
title: "Three.js Postprocessing Guide"
tags: [threejs, postprocessing, bloom, composer, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/ThreeJS"
---

# ⚡ Three.js Postprocessing Guide

> **Имя скилла:** `threejs-postprocessing`  
> **Локальный путь:** `/root/.agent/skills/threejs/references/postprocessing.md`  
> **Описание:** Эффекты постобработки кадра: EffectComposer, Bloom, FXAA.

---

# Postprocessing Pipeline Reference

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function setupPostprocessing(renderer, scene, camera, width, height) {
  const composer = new EffectComposer(renderer);

  // 1. Base Render Pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. Bloom Pass
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.6, // strength
    0.4, // radius
    0.85 // threshold
  );
  composer.addPass(bloomPass);

  // 3. Color Management & Output Pass
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return composer;
}
```

