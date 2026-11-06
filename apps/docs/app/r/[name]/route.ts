import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistryFile = {
  path: string;
  type?: string;
  target?: string;
  content?: string;
};

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
};

function repoRoot(): string {
  // apps/docs -> repo root (3 levels up from apps/docs/app/r/[name])
  return path.resolve(process.cwd(), "..", "..");
}

function loadItem(name: string): RegistryItem | null {
  const root = repoRoot();
  const manifestPath = path.join(root, "registry.json");
  if (!fs.existsSync(manifestPath)) return null;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as {
    items: RegistryItem[];
  };
  const item = manifest.items.find((i) => i.name === name);
  if (!item) return null;

  const files: RegistryFile[] = item.files.map((f) => {
    const srcCandidates = [
      path.join(root, "packages", "registry", f.path),
      path.resolve(process.cwd(), f.path),
    ];
    let content: string | undefined;
    for (const c of srcCandidates) {
      try {
        if (fs.existsSync(c)) {
          content = fs.readFileSync(c, "utf-8");
          break;
        }
      } catch {
        // try next
      }
    }
    if (!content) {
      throw new Error(`File not found for ${f.path} (item: ${name})`);
    }
    return { ...f, content };
  });

  return { ...item, files };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  try {
    const item = loadItem(name);
    if (!item) {
      return Response.json({ error: "Not found", name }, { status: 404 });
    }
    return Response.json(item);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
