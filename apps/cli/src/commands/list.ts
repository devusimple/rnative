import chalk from "chalk";
import { fetchManifest } from "../lib/registry";

export async function runList(): Promise<void> {
  const manifest = await fetchManifest();
  console.log(chalk.bold(`${manifest.name} registry\n`));
  for (const item of manifest.items) {
    console.log(
      `${chalk.cyan(item.name)}  ${chalk.dim(item.type)}  ${item.title ?? ""}`,
    );
    if (item.description) console.log(`  ${chalk.dim(item.description)}`);
    if (item.files?.length) {
      for (const f of item.files) console.log(`  ${chalk.dim("→")} ${f.path}`);
    }
    console.log();
  }
  console.log(chalk.dim(`Add one with: rnative add <name>`));
}
