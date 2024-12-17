#!/usr/bin/env node

import { Command } from "commander";
import { generate } from "./generate";
import dotenv from "dotenv";
import path from "node:path";

// Load environment variables
dotenv.config();

const program = new Command();

// CLI metadata
program
  .name("cockpit-client")
  .description("CLI for generating cockpit-client outputs")
  .version("1.0.0");

// Generate command
program
  .command("generate")
  .description("Generate the client output file")
  .option("-sn, --singleton-name <collection-name>", "Collection name of the dedicated singleton collection")
  .requiredOption("-o, --output <path>", "Output file path")
  .action(async (options) => {
    try {

      const fullPath = path.resolve(process.cwd(), options.output);
      console.log(`Generating client output at: ${fullPath}`);
      await generate(fullPath, options.singletonName ?? "internal-data");
      console.log("Client output generated successfully.");
    } catch (error) {
      console.error("Error during generation:", error);
      process.exit(1); // Exit with failure code
    }
  });

// Parse arguments asynchronously
program.parseAsync(process.argv);
