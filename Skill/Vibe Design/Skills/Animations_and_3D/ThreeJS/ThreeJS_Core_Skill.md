---
title: "Three.js Core Skill"
tags: [threejs, 3d, webgl, webgpu, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/ThreeJS"
---

# ⚡ Three.js Core Skill

> **Имя скилла:** `threejs`  
> **Локальный путь:** `/root/.agent/skills/threejs/SKILL.md`  
> **Описание:** Главный движок Three.js: сцены, камеры, рендеры, PBR материалы, свет, анимация.

---

# Three.js 3D Graphics Skill

Three.js is the standard JavaScript 3D library for creating GPU-accelerated 3D graphics on the web (using WebGL and WebGPU).

---

## 1. Boilerplate & Scene Setup

### Modern ESM Import (Browser / Bundler)
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
```

### Complete Scene Initialization Blueprint
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Container & Canvas setup
const container = document.getElementById('canvas-container') || document.body;
const width = container.clientWidth || window.innerWidth;
const height = container.clientHeight || window.innerHeight;

// 2. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// 3. Camera
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 2, 5);

// 4. Renderer (WebGL / WebGPU)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// 5. Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 6. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// 7. Responsive Resize Handler
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth || window.innerWidth;
  const newHeight = container.clientHeight || window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 8. Animation Loop
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();

  controls.update();
  renderer.render(scene, camera);
});
```

---

## 2. Geometries & Materials

### Standard Geometries
- `new THREE.BoxGeometry(width, height, depth)`
- `new THREE.SphereGeometry(radius, widthSegments, heightSegments)`
- `new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)`
- `new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)`
- `new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments)`

### PBR Material Setup (MeshStandardMaterial & MeshPhysicalMaterial)
```js
const textureLoader = new THREE.TextureLoader();

const colorMap = textureLoader.load('/textures/albedo.jpg');
const normalMap = textureLoader.load('/textures/normal.jpg');
const roughnessMap = textureLoader.load('/textures/roughness.jpg');
const metalnessMap = textureLoader.load('/textures/metalness.jpg');

// Ensure correct color space for albedo maps
colorMap.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 0.4,
  metalnessMap: metalnessMap,
  metalness: 0.8,
  envMapIntensity: 1.0,
});

const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);
```

---

## 3. Shaders & TSL (Three.js Shading Language)

Modern Three.js supports **TSL (Three.js Shading Language)** for WebGPU/WebGL node materials:

```js
import { MeshStandardNodeMaterial } from 'three/addons/materials/NodeMaterial.js';
import { color, vec3, uv, time, sin, mix } from 'three/tsl';

const material = new MeshStandardNodeMaterial();

// Dynamic animated color in TSL
const wave = sin(time.mul(2.0).add(uv().x.mul(10.0))).mul(0.5).add(0.5);
material.colorNode = mix(color(0x00ffff), color(0xff00ff), wave);
```

For traditional GLSL shaders:
```js
const customMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x3b82f6) },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + uTime) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(uColor * vUv.y, 1.0);
    }
  `,
  side: THREE.DoubleSide,
});
```

---

## 4. Asset Loading & Environments

### GLTF / GLB Loader with DRACO Compression
```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  '/models/character.glb',
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
  },
  (progress) => console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%'),
  (error) => console.error('An error occurred:', error)
);
```

### HDRI Environment Map
```js
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

new RGBELoader().load('/env/studio.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
```

---

## 5. Interaction & Raycasting

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});
```

---

## 6. Performance & Memory Best Practices

1. **InstancedMesh**: Use `THREE.InstancedMesh` for rendering hundreds/thousands of identical geometries (e.g. foliage, particles, grids).
2. **Disposal Pattern**: Always dispose geometries, materials, and textures when removing objects from scene:
   ```js
   mesh.geometry.dispose();
   if (Array.isArray(mesh.material)) {
     mesh.material.forEach(m => m.dispose());
   } else {
     mesh.material.dispose();
   }
   ```
3. **PixelRatio Capping**: Always cap `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to avoid rendering 4K on high-DPI mobile devices.
4. **Shadow Optimization**: Keep shadow map dimensions reasonable (1024x1024 or 2048x2048) and fit shadow camera bounds tightly to the scene.

---

## Reference Guides

- [TSL Shading & Node Materials](file:///root/.agent/skills/threejs/references/tsl-shading.md)
- [GLTF Loading & Draco Compression](file:///root/.agent/skills/threejs/references/gltf-loading.md)
- [Postprocessing & FX Pipeline](file:///root/.agent/skills/threejs/references/postprocessing.md)
