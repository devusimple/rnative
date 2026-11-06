#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { runInit } from "./commands/init";
import { runAdd } from "./commands/add";
import { runList } from "./commands/list";

const program = new Command();

program
  .name("rnative")
  .description("CLI for rnative components")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize rnative in a project")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .option("-f, --force", "Overwrite existing config")
  .action(async (opts) => {
    try {
      await runInit({ cwd: opts.cwd, force: opts.force });
    } catch (err) {
      console.error(chalk.red("Error:"), (err as Error).message);
      process.exit(1);
    }
  });

program
  .command("add <component>")
  .description("Add a component to your project")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .option("-o, --overwrite", "Overwrite existing files")
  .option("--skip-deps", "Skip registry dependency resolution")
  .action(async (component: string, opts) => {
    try {
      await runAdd(component, {
        cwd: opts.cwd,
        overwrite: opts.overwrite,
        skipDeps: opts.skipDeps,
      });
    } catch (err) {
      console.error(chalk.red("Error:"), (err as Error).message);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List available components in the registry")
  .action(async () => {
    try {
      await runList();
    } catch (err) {
      console.error(chalk.red("Error:"), (err as Error).message);
      process.exit(1);
    }
  });

program.parse(process.argv);
