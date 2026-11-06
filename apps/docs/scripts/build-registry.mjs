// Builds static /public/r/*.json files from the monorepo registry manifest.
// Run via `pnpm --filter @rnative/docs build` or `node scripts/build-registry.mjs`
import * as fs from "fs";
import * as path from "path";

const repoRoot = path.resolve(process.cwd(), "..", "..");
const manifestPath = path.join(repoRoot, "registry.json");
const outDir = path.join(process.cwd(), "public", "r");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
fs.mkdirSync(outDir, { recursive: true });

for (const item of manifest.items) {
  const files = item.files.map((f) => {
    const src = path.join(repoRoot, "packages", "registry", f.path);
    const content = fs.readFileSync(src, "utf-8");
    return { ...f, content };
  });
  const outPath = path.join(outDir, `${item.name}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ ...item, files }, null, 2) + "\n");
  console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
}

// Also copy manifest for clients that fetch /r/registry.json
fs.writeFileSync(path.join(outDir, "registry.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${path.join("public", "r", "registry.json")}`);
