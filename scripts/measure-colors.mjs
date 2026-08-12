#!/usr/bin/env node
// Deterministic color measurement for the design-dna skill.
//
// Instead of perceiving colors from a screenshot (which drifts toward familiar
// palette defaults), this measures them: k-means clustering over the actual
// pixels, perceptual (CIE ΔE) merging of near-duplicate clusters, and coverage
// percentages. The output is meant to be merged into `design_system.color` of
// a Design DNA JSON — exact hexes with evidence, not guesses.
//
// Usage:
//   node scripts/measure-colors.mjs <screenshot.(png|jpg|webp)> [--k 8]
//
// Output (stdout): JSON
//   {
//     "source": { "file", "width", "height" },
//     "palette": [ { "hex", "coverage", "role" } ... ],
//     "measured": true
//   }

import sharp from "sharp";
import { basename, extname } from "node:path";
import { deltaE, hex, hsv } from "./color-math.mjs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: node scripts/measure-colors.mjs <image> [--k 8]");
  process.exit(1);
}
const kIdx = args.indexOf("--k");
const K = kIdx >= 0 ? Math.max(2, Math.min(16, Number(args[kIdx + 1]) || 8)) : 8;

// ---------- k-means ----------

function kmeans(pixels, k, iters = 24) {
  // deterministic farthest-point init: start from the darkest pixel, then
  // repeatedly add the pixel farthest from its nearest existing center, so
  // small but distinct color regions get their own cluster
  const sorted = [...pixels].sort(
    (a, b) => a[0] * 3 + a[1] * 6 + a[2] - (b[0] * 3 + b[1] * 6 + b[2])
  );
  const centers = [[...sorted[0]]];
  const nearest = new Array(pixels.length).fill(Infinity);
  while (centers.length < k) {
    const last = centers[centers.length - 1];
    let far = 0, fd = -1;
    for (let p = 0; p < pixels.length; p++) {
      const dx = pixels[p][0] - last[0];
      const dy = pixels[p][1] - last[1];
      const dz = pixels[p][2] - last[2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < nearest[p]) nearest[p] = d;
      if (nearest[p] > fd) (fd = nearest[p]), (far = p);
    }
    if (fd <= 0) break; // fewer distinct colors than k
    centers.push([...pixels[far]]);
  }
  k = centers.length;
  const assign = new Array(pixels.length).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let p = 0; p < pixels.length; p++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) {
        const dx = pixels[p][0] - centers[c][0];
        const dy = pixels[p][1] - centers[c][1];
        const dz = pixels[p][2] - centers[c][2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bd) (bd = d), (best = c);
      }
      if (assign[p] !== best) (assign[p] = best), (moved = true);
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let p = 0; p < pixels.length; p++) {
      const s = sums[assign[p]];
      s[0] += pixels[p][0]; s[1] += pixels[p][1]; s[2] += pixels[p][2]; s[3]++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3] > 0) {
        centers[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
      }
    }
    if (!moved) break;
  }
  const counts = new Array(k).fill(0);
  for (const a of assign) counts[a]++;
  return centers
    .map((center, i) => ({ center, share: counts[i] / pixels.length }))
    .filter((c) => c.share > 0)
    .sort((a, b) => b.share - a.share);
}

// merge perceptually-identical clusters (anti-aliasing / jpeg noise)
function mergeSimilar(clusters, maxDE = 2.5) {
  const merged = [];
  for (const c of clusters) {
    const near = merged.find((m) => deltaE(m.center, c.center) <= maxDE);
    if (near) {
      const total = near.share + c.share;
      near.center = near.center.map(
        (v, i) => (v * near.share + c.center[i] * c.share) / total
      );
      near.share = total;
    } else {
      merged.push({ center: [...c.center], share: c.share });
    }
  }
  return merged.sort((a, b) => b.share - a.share);
}

// ---------- role assignment ----------

function assignRoles(clusters) {
  const entries = clusters.map(({ center, share }) => {
    const [h, s, l] = hsv(center);
    return { center, share, h, s, l, role: "unassigned" };
  });
  const taken = new Set();
  // background: largest coverage
  entries[0].role = "background";
  taken.add(0);
  const bgL = entries[0].l;
  // text: strongest lightness contrast vs background with meaningful coverage
  let text = -1, bestC = 0;
  entries.forEach((e, i) => {
    if (taken.has(i)) return;
    const c = Math.abs(e.l - bgL);
    if (e.share >= 0.005 && c > bestC) (bestC = c), (text = i);
  });
  if (text >= 0 && bestC > 0.25) {
    entries[text].role = "text";
    taken.add(text);
  }
  // accent: most saturated remaining color with ≥0.2% coverage; near-white and
  // near-black clusters are excluded — they are surfaces/ink, not accents
  const accents = entries
    .map((e, i) => ({ e, i }))
    .filter(
      ({ e, i }) =>
        !taken.has(i) && e.s >= 0.25 && e.share >= 0.002 && e.l >= 0.08 && e.l <= 0.92
    )
    .sort((a, b) => b.e.s * Math.sqrt(b.e.share) - a.e.s * Math.sqrt(a.e.share));
  if (accents.length > 0) {
    entries[accents[0].i].role = "accent";
    taken.add(accents[0].i);
  }
  return entries;
}

// ---------- main ----------

const img = sharp(file).flatten({ background: "#ffffff" }).toColourspace("srgb");
let width, height;
try {
  ({ width, height } = await img.metadata());
} catch (err) {
  console.error(`error: cannot read ${file}: ${err.message}`);
  process.exit(1);
}
const MAX = 400; // downsample for clustering speed; colors are unaffected
const scale = Math.min(1, MAX / Math.max(width, height));
const w = Math.max(1, Math.round(width * scale));
const h = Math.max(1, Math.round(height * scale));
const raw = await img.resize(w, h, { kernel: "nearest" }).raw().toBuffer();

const pixels = [];
for (let i = 0; i + 2 < raw.length; i += 3) {
  pixels.push([raw[i], raw[i + 1], raw[i + 2]]);
}

// JPEG compression spreads flat colors into wider noise bands than PNG/WebP
const isJpeg = [".jpg", ".jpeg"].includes(extname(file).toLowerCase());
const palette = assignRoles(mergeSimilar(kmeans(pixels, K), isJpeg ? 5 : 2.5));

console.log(
  JSON.stringify(
    {
      source: { file: basename(file), width, height },
      palette: palette.map((p) => ({
        hex: hex(p.center),
        coverage: Number(p.share.toFixed(4)),
        role: p.role,
      })),
      measured: true,
    },
    null,
    2
  )
);
