// src/lib/cli-reference/system-commands.ts
import { type CommandDef, HELP_FLAG } from "./types";

export const SYSTEM_COMMANDS: Readonly<Record<string, CommandDef>> = {
	generate: {
		purpose: "Generates shell completion scripts for woof.",
		synopsis: "woof generate <SHELL>",
		flags: [
			{
				name: "<SHELL>",
				type: "argument",
				description: "Target shell. Possible values: bash, elvish, fish, powershell, zsh",
			},
			HELP_FLAG,
		],
		exitCodes: { 0: "Script generated to standard output.", 1: "Invalid shell specified." },
		examples: [
			{
				command: "woof generate bash > ~/.local/share/bash-completion/completions/woof",
				output: "(No output, redirects to file)",
				explanation: "Generates and saves the bash completion script.",
			},
			{
				command: "woof generate fish | source",
				output: "Completions loaded.",
				explanation: "Generates and immediately sources fish completions.",
			},
			{
				command: "woof generate unknown",
				output: "Error: Invalid value 'unknown' for <SHELL>",
				explanation: "Fails when an unsupported shell is requested.",
			},
		],
	},
	version: {
		purpose: "Displays version information.",
		synopsis: "woof version",
		flags: [HELP_FLAG],
		exitCodes: { 0: "Version displayed." },
		examples: [
			{
				command: "woof version",
				output: "woof 0.3.0",
				explanation: "Prints the current binary version.",
			},
			{ command: "woof version --help", output: "Usage: woof version", explanation: "Shows help." },
		],
	},
	update: {
		purpose: "Updates the Rustywoof engine to the latest version.",
		synopsis: "woof update",
		flags: [HELP_FLAG],
		exitCodes: {
			0: "Update successful or already at latest version.",
			1: "Network error during update.",
		},
		examples: [
			{
				command: "woof update",
				output: "Checking for updates...\n✓ Already up to date (0.3.0).",
				explanation: "Checks remote registry and confirms current version is latest.",
			},
			{
				command: "woof update",
				output: "Downloading 0.4.0...\n✓ Successfully updated to 0.4.0.",
				explanation: "Downloads and replaces the binary.",
			},
			{
				command: "woof update",
				output: "Error: Connection timed out.",
				explanation: "Fails gracefully if offline.",
			},
		],
	},
};
