import chalk from "chalk";
import * as path from "path";
import { fetchItem, fetchManifest, resolveItemOrder } from "../lib/registry";
import { readConfig, writeFile } from "../lib/fs";

export interface AddOptions {
  cwd?: string;
  overwrite?: boolean;
  skipDeps?: boolean;
}

export async function runAdd(component: string, opts: AddOptions = {}): Promise<void> {
  const cwd = path.resolve(opts.cwd ?? process.cwd());
  const config = readConfig(cwd);

  if (!config) {
    console.log(
      chalk.yellow(
        "No components.json found. Run `rnative init` first, or the component will be written to src/components.",
      ),
    );
  }

  const manifest = await fetchManifest();
  const ordered = resolveItemOrder(manifest, component);
  if (opts.skipDeps) {
    const only = ordered.filter((i) => i.name === component);
    await writeItems(cwd, only, opts);
    return;
  }
  await writeItems(cwd, ordered, opts);

  // Collect npm dependencies to install (simple hint - actual install is opt-in in v1)
  const deps = new Set<string>();
  for (const item of ordered) {
    for (const d of item.dependencies ?? []) deps.add(d);
  }
  if (deps.size > 0) {
    console.log(
      `\n${chalk.bold("Dependencies:")} ${[...deps].join(", ")}\nRun ${chalk.cyan(
        `npm install ${[...deps].join(" ")}`,
      )} to install them.`,
    );
  }
}

async function writeItems(
  cwd: string,
  items: Awaited<ReturnType<typeof fetchItem>>[],
  opts: AddOptions,
): Promise<void> {
  for (const item of items) {
    console.log(chalk.bold(`\nAdding ${item.name}...`));
    // Re-fetch to hydrate contents if needed
    let files = item.files;
    if (!files[0]?.content) {
      const full = await fetchItem(item.name);
      files = full.files;
    }
    for (const file of files) {
      const relPath = file.path.replace(/^src\//, "src/");
      const result = writeFile(cwd, relPath, file.content ?? "", {
        force: opts.overwrite,
      });
      const label =
        result === "skipped" ? chalk.yellow("skipped") : result === "overwritten" ? chalk.cyan("overwritten") : chalk.green("written");
      console.log(`  ${label} ${path.relative(cwd, path.resolve(cwd, relPath))}`);
    }
  }
}
