import * as fs from "fs";
import * as path from "path";

export interface RegistryFile {
  path: string;
  type?: string;
  content?: string;
  target?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
}

export interface RegistryManifest {
  $schema?: string;
  name: string;
  homepage?: string;
  items: RegistryItem[];
}

export const REGISTRY_URL = process.env.RNATIVE_REGISTRY_URL ?? "https://rnative.vercel.app/r";

async function readLocalManifest(): Promise<RegistryManifest | null> {
  const candidates = [
    path.resolve(process.cwd(), "registry.json"),
    path.resolve(__dirname, "../../../../registry.json"),
    path.resolve(__dirname, "../../../registry.json"),
  ];
  for (const p of candidates) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      return JSON.parse(raw) as RegistryManifest;
    } catch {
      // try next
    }
  }
  return null;
}

export async function fetchManifest(): Promise<RegistryManifest> {
  const local = await readLocalManifest();
  if (local) return local;
  const res = await fetch(`${REGISTRY_URL}/registry.json`);
  if (!res.ok) throw new Error(`Failed to fetch registry manifest: ${res.status}`);
  return (await res.json()) as RegistryManifest;
}

export async function fetchItem(name: string): Promise<RegistryItem> {
  // Try remote single-item endpoint first (docs /r/[name] route)
  try {
    const res = await fetch(`${REGISTRY_URL}/${name}.json`);
    if (res.ok) {
      const json = (await res.json()) as RegistryItem;
      if (json && json.name) return json;
    }
  } catch {
    // fall back to manifest
  }
  const manifest = await fetchManifest();
  const item = manifest.items.find((i) => i.name === name);
  if (!item) throw new Error(`Component "${name}" not found in registry`);
  // Hydrate file contents from local monorepo source when available
  const hydrated: RegistryFile[] = [];
  for (const f of item.files) {
    let content = f.content;
    if (!content) {
      const candidates = [
        path.resolve(process.cwd(), f.path),
        path.resolve(__dirname, "../../../../packages/registry", f.path),
      ];
      for (const c of candidates) {
        try {
          content = fs.readFileSync(c, "utf-8");
          break;
        } catch {
          // try next
        }
      }
    }
    if (!content) throw new Error(`Could not load file content for ${f.path} (item: ${name})`);
    hydrated.push({ ...f, content });
  }
  return { ...item, files: hydrated };
}

export function resolveItemOrder(
  manifest: RegistryManifest,
  target: string,
): RegistryItem[] {
  const byName = new Map(manifest.items.map((i) => [i.name, i]));
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    const item = byName.get(name);
    if (!item) throw new Error(`Unknown registry dependency: ${name}`);
    for (const dep of item.registryDependencies ?? []) visit(dep);
    seen.add(name);
    ordered.push(item);
  };
  visit(target);
  return ordered;
}
