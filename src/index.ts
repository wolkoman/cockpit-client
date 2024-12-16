#!/usr/bin/env node
import {Command} from "commander";
import {generate} from "./generate";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

const program = new Command();
console.log("TEST")
program
  .name("cockpit-client")
  .description("CLI for generating cockpit-client outputs")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate the client output file")
  .requiredOption("-o, --output <path>", "Output file path")
  .action(async (options) => {
    try {
      const fullPath = path.resolve(process.cwd(), options.output);
      await generate(fullPath);
    } catch (error) {
      console.error("Error:", error);
      process.exit(1); // Exit with failure code
    }
  });

program.parseAsync(process.argv); // Use `parseAsync` for async commands
