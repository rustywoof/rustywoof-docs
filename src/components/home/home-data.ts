// src/components/home/home-data.ts
import type { CliTabGroup } from "@/components/ui";
import { SCAN_SAMPLES } from "./scan-samples";

export { SCAN_SAMPLES };

export const INSTALL_GROUPS: readonly CliTabGroup[] = [
	{
		id: "cargo",
		label: "Rust",
		icon: "rust",
		items: [{ id: "cargo", label: "cargo", icon: "cargo", command: "cargo install rustywoof" }],
	},
	{
		id: "node",
		label: "Node.js",
		icon: "node",
		items: [
			{ id: "npm", label: "npm", icon: "npm", command: "npm i -D @ianramy/rustywoof" },
			{ id: "pnpm", label: "pnpm", icon: "pnpm", command: "pnpm add -D @ianramy/rustywoof" },
			{ id: "yarn", label: "yarn", icon: "yarn", command: "yarn add -D @ianramy/rustywoof" },
			{ id: "bun", label: "bun", icon: "bun", command: "bun add -d @ianramy/rustywoof" },
			{
				id: "deno",
				label: "deno",
				icon: "deno",
				command: "deno add --dev npm:@ianramy/rustywoof",
			},
		],
	},
	{
		id: "python",
		label: "Python",
		icon: "python",
		items: [
			{ id: "pipx", label: "pipx", icon: "pipx", command: "pipx install rustywoof" },
			{ id: "uv", label: "uv", icon: "uv", command: "uv tool install rustywoof" },
		],
	},
	{
		id: "shell",
		label: "Shell",
		icon: "bash",
		items: [
			{
				id: "sh",
				label: "curl",
				icon: "curl",
				command: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustywoof.dev | sh",
			},
		],
	},
];
