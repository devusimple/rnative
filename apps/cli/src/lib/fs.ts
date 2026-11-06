import * as fs from "fs";
import * as path from "path";

export interface RnativeConfig {
  $schema?: string;
  name?: string;
  style?: string;
  aliases?: {
    components?: string;
    lib?: string;
    theme?: string;
  };
  r?: string;
  [key: string]: unknown;
}

export const DEFAULT_CONFIG: RnativeConfig = {
  name: "rnative",
  style: "default",
  aliases: {
    components: "@/components",
    lib: "@/lib",
    theme: "@/theme",
  },
  r: "https://rnative.vercel.app/r",
};

export function readConfig(cwd: string): RnativeConfig | null {
  const p = path.resolve(cwd, "components.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as RnativeConfig;
  } catch {
    return null;
  }
}

export function writeConfig(cwd: string, config: RnativeConfig): string {
  const p = path.resolve(cwd, "components.json");
  fs.writeFileSync(p, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return p;
}

export function resolveTargetDir(cwd: string, config: RnativeConfig): string {
  const alias = config.aliases?.components ?? "@/components";
  const stripped = alias.replace(/^@\//, "").replace(/^\.\//, "");
  return path.resolve(cwd, "src", stripped);
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeFile(
  cwd: string,
  filePath: string,
  content: string,
  opts: { force?: boolean } = {},
): "written" | "skipped" | "overwritten" {
  const dest = filePath.startsWith("/") ? filePath : path.resolve(cwd, filePath);
  ensureDir(path.dirname(dest));
  if (fs.existsSync(dest) && !opts.force) return "skipped";
  const overwritten = fs.existsSync(dest);
  fs.writeFileSync(dest, content, "utf-8");
  return overwritten ? "overwritten" : "written";
}

export function pathExists(p: string): boolean {
  return fs.existsSync(p);
}
