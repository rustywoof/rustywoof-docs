// src/lib/cli-reference/repo-commands.ts
import { type CommandDef, HELP_FLAG } from "./types";

export const REPO_COMMANDS: Readonly<Record<string, CommandDef>> = {
	hook: {
		purpose: "Manages Git pre-commit hooks to prevent secret leakage.",
		synopsis: "woof hook <COMMAND>",
		flags: [
			{
				name: "install",
				type: "subcommand",
				description: "Installs the pre-commit hook into the current git repository.",
			},
			{
				name: "remove",
				type: "subcommand",
				description: "Removes the pre-commit hook from the current git repository.",
			},
			{ name: "help", type: "subcommand", description: "Print help for the hook command." },
			HELP_FLAG,
		],
		exitCodes: {
			0: "Hook successfully installed or removed.",
			1: "Not a git repository, or unable to write to the .git/hooks directory.",
		},
		examples: [
			{
				command: "woof hook install",
				output: "✓ Pre-commit hook installed to .git/hooks/pre-commit",
				explanation: "Activates Rustywoof scanning on every git commit.",
			},
			{
				command: "woof hook remove",
				output: "✓ Pre-commit hook removed.",
				explanation: "Deactivates local commit scanning.",
			},
			{
				command: "woof hook help",
				output: "Usage: woof hook <COMMAND>...",
				explanation: "Displays help specifically for the hook subcommands.",
			},
		],
		edgeCases: ["Fails gracefully if run outside of a git repository."],
	},
	init: {
		purpose: "Initializes a local .woof.toml configuration file.",
		synopsis: "woof init",
		flags: [HELP_FLAG],
		exitCodes: {
			0: "Configuration file created, or skipped if .woof.toml already exists.",
		},
		examples: [
			{
				command: "woof init",
				output: "✓ Created .woof.toml in current directory.",
				explanation: "Bootstraps a fresh configuration file.",
			},
			{
				command: "woof init",
				output: "[!] .woof.toml already exists. Skipping.",
				explanation: "Prevents accidental overwrites of existing configurations.",
			},
			{
				command: "woof init --help",
				output: "Usage: woof init",
				explanation: "Shows help for the init command.",
			},
		],
	},
	cache: {
		purpose: "Manages local cache state for OSV databases and scan heuristics.",
		synopsis: "woof cache <COMMAND>",
		flags: [
			{ name: "clean", type: "subcommand", description: "Clears the local cache directory." },
			{ name: "help", type: "subcommand", description: "Print help for the cache command." },
			HELP_FLAG,
		],
		exitCodes: { 0: "Cache operation successful." },
		examples: [
			{
				command: "woof cache clean",
				output: "✓ Local OSV threat intelligence cache completely purged.",
				explanation: "Frees up disk space and forces a fresh download on the next audit.",
			},
			{
				command: "woof cache clean",
				output: "✓ No cache files found. Nothing to clean.",
				explanation: "No cache files found. Nothing to clean.",
			},
			{
				command: "woof cache help",
				output: "Usage: woof cache <COMMAND>",
				explanation: "Shows subcommand help.",
			},
		],
	},
};
