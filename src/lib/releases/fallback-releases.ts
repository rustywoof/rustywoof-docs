// src/lib/releases/fallback-releases.ts
import { FALLBACK_COMMITS } from "./fallback-commits";
import { GITHUB_REPO, type ReleaseEntry } from "./types";

export const FALLBACK_RELEASES: readonly ReleaseEntry[] = [
	{
		version: "v0.3.0",
		name: "rustywoof v0.3.0",
		date: "September 2026",
		url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.3.0`,
		commitsUrl: `https://github.com/${GITHUB_REPO}/commits/v0.3.0`,
		channel: "Latest Stable",
		latest: true,
		summary:
			"Introduces the WebAssembly browser scanner engine, batched OSV lockfile queries, and transitive dependency graph tracing.",
		highlights: [
			{
				id: "v030-1",
				type: "Added",
				text: "Interactive client-side WebAssembly (WASM) secret scanner and multi-ecosystem lockfile workbench.",
			},
			{
				id: "v030-2",
				type: "Added",
				text: "Transitive dependency graph tracing via woof sniff for Cargo.lock, package.json, and Python lockfiles.",
			},
			{
				id: "v030-3",
				type: "Changed",
				text: "OSV dependency auditor now batches API queries into a single HTTP request.",
			},
			{
				id: "v030-4",
				type: "Fixed",
				text: "Corrected literal prefix matching false positives in the Aho-Corasick automaton.",
			},
		],
		commits: FALLBACK_COMMITS,
	},
	{
		version: "v0.2.0",
		name: "rustywoof v0.2.0",
		date: "August 2026",
		url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.2.0`,
		commitsUrl: `https://github.com/${GITHUB_REPO}/commits/v0.2.0`,
		channel: "Stable",
		latest: false,
		summary:
			"Automated Git pre-commit hook management and Shannon entropy heuristics for unprefixed credentials.",
		highlights: [
			{
				id: "v020-1",
				type: "Added",
				text: "Git pre-commit hook lifecycle management (woof hook install & woof hook remove).",
			},
			{
				id: "v020-2",
				type: "Added",
				text: "Initial .env detection heuristics and Shannon entropy scoring.",
			},
		],
		commits: FALLBACK_COMMITS.slice(10),
	},
	{
		version: "v0.1.0",
		name: "Rustywoof v0.1.0",
		date: "June 2026",
		url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.0`,
		commitsUrl: `https://github.com/${GITHUB_REPO}/commits/v0.1.0`,
		channel: "Initial Release",
		latest: false,
		summary:
			"Initial open-source CLI featuring memory-mapped file traversal and built-in cloud secret rules.",
		highlights: [
			{
				id: "v010-1",
				type: "Added",
				text: "Initial CLI with multi-core memory-mapped directory scanning.",
			},
		],
		commits: FALLBACK_COMMITS.slice(12),
	},
];
