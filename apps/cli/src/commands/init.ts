import chalk from "chalk";
import * as path from "path";
import {
  DEFAULT_CONFIG,
  ensureDir,
  readConfig,
  resolveTargetDir,
  writeConfig,
} from "../lib/fs";

export interface InitOptions {
  cwd?: string;
  force?: boolean;
}

export async function runInit(opts: InitOptions = {}): Promise<void> {
  const cwd = path.resolve(opts.cwd ?? process.cwd());
  const existing = readConfig(cwd);

  if (existing) {
    console.log(chalk.yellow("components.json already exists in this project."));
    if (!opts.force) {
      console.log("Run with --force to overwrite.");
      return;
    }
  }

  const config = { ...DEFAULT_CONFIG };
  const configPath = writeConfig(cwd, config);
  console.log(chalk.green("✓") + ` Created ${chalk.bold(path.relative(cwd, configPath))}`);

  const targetDir = resolveTargetDir(cwd, config);
  const dirs = [
    targetDir,
    path.resolve(targetDir, "ui"),
    path.resolve(targetDir, "blocks"),
    path.resolve(cwd, "src", "lib"),
    path.resolve(cwd, "src", "theme"),
  ];
  for (const d of dirs) {
    ensureDir(d);
    console.log(chalk.green("✓") + ` Created ${chalk.bold(path.relative(cwd, d) + "/")}`);
  }

  console.log(
    `\n${chalk.bold("Next step:")} run ${chalk.cyan("rnative add button")} to add components.`,
  );
}
