#!/usr/bin/env node
// Verify loop for the design-dna skill.
//
// After generating an implementation from a Design DNA JSON, screenshot the
// result and score it against the reference measurement. This turns "does it
// look right?" into a number the agent can iterate on.
//
// Usage:
//   node scripts/measure-colors.mjs reference.png > measured.json
//   node scripts/verify.mjs implementation.png measured.json
//
// Output (stdout): JSON report with per-color ΔE and coverage drift, plus
// PASS/FAIL on stderr. Exit code 0 = pass, 2 = fail.
//
// Thresholds: mean ΔE ≤ 5, max ΔE ≤ 20, coverage drift ≤ 0.35.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { deltaE, parseHex } from "./color-math.mjs";

const [imgFile, specFile] = process.argv.slice(2);
if (!imgFile || !specFile) {
  console.error("usage: node scripts/verify.mjs <implementation.png> <measured.json>");
  process.exit(1);
}

const spec = JSON.parse(readFileSync(specFile, "utf8"));
const specPalette = spec.palette ?? spec.design_system?.color?.measured_palette;
if (!Array.isArray(specPalette)) {
  console.error("measured.json must contain a `palette` array (from measure-colors.mjs)");
  process.exit(1);
}

// re-measure the implementation with the same deterministic pipeline
const here = dirname(fileURLToPath(import.meta.url));
const out = execFileSync(
  process.execPath,
  [join(here, "measure-colors.mjs"), imgFile, "--k", String(Math.min(16, Math.max(specPalette.length + 4, 8)))],
  { encoding: "utf8" }
);
const impl = JSON.parse(out);

const dE = (a, b) => deltaE(parseHex(a), parseHex(b));

// Partition the implementation's clusters by their nearest spec color, so a
// spec color that re-measures as several nearby clusters is credited with
// their combined coverage instead of a single nearest match.
const assigned = specPalette.map(() => []);
for (const c of impl.palette) {
  let best = 0, bd = Infinity;
  specPalette.forEach((s, i) => {
    const d = dE(s.hex, c.hex);
    if (d < bd) (bd = d), (best = i);
  });
  assigned[best].push({ ...c, deltaE: bd });
}

const entries = specPalette.map((s, i) => {
  const group = assigned[i];
  const cov = group.reduce((t, g) => t + g.coverage, 0);
  let de, nearest;
  if (group.length > 0 && cov > 0) {
    de = group.reduce((t, g) => t + g.deltaE * g.coverage, 0) / cov;
    nearest = group.sort((a, b) => a.deltaE - b.deltaE)[0].hex;
  } else {
    let bd = Infinity;
    for (const c of impl.palette) {
      const d = dE(s.hex, c.hex);
      if (d < bd) (bd = d), (nearest = c.hex);
    }
    de = bd;
  }
  return {
    specHex: s.hex,
    role: s.role,
    nearestImageHex: nearest,
    deltaE: Number(de.toFixed(2)),
    specCoverage: s.coverage,
    imageCoverage: Number(cov.toFixed(4)),
  };
});

// coverage-weighted mean ΔE + coverage drift
let meanDE = 0, drift = 0, wsum = 0;
for (const e of entries) {
  meanDE += e.deltaE * e.specCoverage;
  drift += Math.abs(e.specCoverage - e.imageCoverage);
  wsum += e.specCoverage;
}
meanDE = wsum > 0 ? meanDE / wsum : 0;
// max ΔE considers only colors with meaningful coverage (≥0.5%) so a stray
// sub-percent cluster can't fail an otherwise faithful implementation
const significant = entries.filter((e) => e.specCoverage >= 0.005);
const maxDE = Math.max(...(significant.length ? significant : entries).map((e) => e.deltaE));

const pass = meanDE <= 5 && maxDE <= 20 && drift <= 0.35;
console.log(
  JSON.stringify(
    {
      implementation: imgFile,
      reference: specFile,
      entries,
      meanDeltaE: Number(meanDE.toFixed(2)),
      maxDeltaE: Number(maxDE.toFixed(2)),
      coverageDrift: Number(drift.toFixed(2)),
      thresholds: { meanDeltaE: 5, maxDeltaE: 20, coverageDrift: 0.35 },
      pass,
    },
    null,
    2
  )
);
console.error(
  `${pass ? "PASS" : "FAIL"} — mean ΔE ${meanDE.toFixed(2)}, max ΔE ${maxDE.toFixed(2)}, coverage drift ${drift.toFixed(2)}`
);
process.exit(pass ? 0 : 2);
