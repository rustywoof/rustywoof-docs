// src/lib/releases/fallback-commits.ts
import { GITHUB_REPO, type ReleaseCommit } from "./types";

/**
 * Constructs a fallback commit record for offline or rate-limited environments.
 */
function buildCommit(sha: string, date: string, message: string): ReleaseCommit {
	const shortSha = sha.slice(0, 7);
	return {
		sha,
		shortSha,
		message,
		date,
		author: "ianramy",
		url: `https://github.com/${GITHUB_REPO}/commit/${shortSha}`,
	};
}

export const FALLBACK_COMMITS: readonly ReleaseCommit[] = [
	buildCommit(
		"be2476b1",
		"Sep 1, 2026",
		"chore(release): optimize release profile and clean up cargo packaging metadata for v0.3.0",
	),
	buildCommit(
		"28d377c2",
		"Sep 1, 2026",
		"build(cargo): refine package metadata and category slugs for crates.io release",
	),
	buildCommit(
		"a16c6373",
		"Sep 1, 2026",
		"refactor(core): modularize command routing and establish the primary binary entrypoint",
	),
	buildCommit(
		"70c1ea54",
		"Sep 1, 2026",
		"refactor(audit): modularize supply chain parsers into discrete audit modules",
	),
	buildCommit(
		"a6cc54b5",
		"Sep 1, 2026",
		"refactor(remediate): modularize vulnerability remediation and lockfile patching",
	),
	buildCommit(
		"ec2796e6",
		"Sep 1, 2026",
		"refactor(patrol): modularize perimeter sweep and sequential exit code handling",
	),
	buildCommit(
		"e65f50a7",
		"Sep 1, 2026",
		"refactor(graph): modularize dependency graph analysis and pathfinding for woof sniff",
	),
	buildCommit(
		"6cb1bc48",
		"Sep 1, 2026",
		"refactor(scanner): modularize detection heuristics and Shannon entropy calculation",
	),
	buildCommit(
		"ce8509a9",
		"Sep 1, 2026",
		"refactor(config): modularize .woof.toml parsing and custom rule prefix compilation",
	),
	buildCommit(
		"5a490bf10",
		"Sep 1, 2026",
		"test(core): establish boundary unit suites covering scanner and lockfile parsers",
	),
	buildCommit(
		"93db06911",
		"Aug 24, 2026",
		"chore(deps): bump owo-colors and terminal rendering dependencies",
	),
	buildCommit(
		"485280912",
		"Aug 24, 2026",
		"refactor(updater): extract binary self-update engine into standalone module",
	),
	buildCommit(
		"3aa1b1113",
		"Aug 24, 2026",
		"feat(updater): rewrite self-update engine with binary path detection",
	),
	buildCommit(
		"8b7210014",
		"Aug 24, 2026",
		"feat(cli): add woof generate command for bash, zsh, and fish completions",
	),
];
