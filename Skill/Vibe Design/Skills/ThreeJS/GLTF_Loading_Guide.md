---
title: "Three.js GLTF Loading Guide"
tags: [threejs, gltf, draco, 3d-models, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/ThreeJS"
---

# ⚡ Three.js GLTF Loading Guide

> **Имя скилла:** `threejs-gltf`  
> **Локальный путь:** `/root/.agent/skills/threejs/references/gltf-loading.md`  
> **Описание:** Загрузка 3D моделей (.gltf/.glb) с DRACO и KTX2.

---

# GLTF & Asset Loading Reference

## Loading GLTF/GLB Models with Draco & KTX2

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

export function loadModel(scene, path, renderer) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/');
  ktx2Loader.detectSupport(renderer);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setKTX2Loader(ktx2Loader);

  let mixer;

  loader.load(path, (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Setup animations if present
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  });

  return {
    update: (delta) => mixer && mixer.update(delta)
  };
}
```

