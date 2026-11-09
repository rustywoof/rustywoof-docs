// src/components/show-release-commits.tsx
"use client";

import { GitCommitHorizontal } from "lucide-react";
import { type ReactElement, useState } from "react";
import type { ReleaseCommit } from "@/lib";

const INITIAL_LIMIT = 10;

interface ShowReleaseCommitsProps {
	readonly version: string;
	readonly commitsUrl: string;
	readonly commits: readonly ReleaseCommit[];
}

/**
 * Renders a single commit row with message, author, date, and short SHA link.
 */
function RenderCommitRow({ commit }: { readonly commit: ReleaseCommit }): ReactElement {
	return (
		<li className="flex flex-col justify-between gap-2 px-4 sm:px-5 py-3 text-sm transition-colors hover:bg-(--surface-hover) sm:flex-row sm:items-center sm:gap-4">
			<a
				href={commit.url}
				target="_blank"
				rel="noopener noreferrer"
				className="line-clamp-2 sm:truncate font-medium text-(--text-primary) no-underline hover:text-(--accent)"
			>
				{commit.message}
			</a>
			<div className="flex shrink-0 flex-wrap items-center gap-3 font-mono text-xs text-(--text-secondary)">
				<span>@{commit.author}</span>
				<span>· {commit.date}</span>
				<a
					href={commit.url}
					target="_blank"
					rel="noopener noreferrer"
					className="rounded border border-(--border-strong) bg-(--surface) px-2 py-0.5 text-(--accent) no-underline hover:border-(--accent)"
				>
					{commit.shortSha}
				</a>
			</div>
		</li>
	);
}

/**
 * Renders the header bar for the release commit log card.
 */
function RenderCommitsHeader({
	version,
	count,
	commitsUrl,
}: {
	readonly version: string;
	readonly count: number;
	readonly commitsUrl: string;
}): ReactElement {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border) bg-(--rw-code-head) px-4 sm:px-5 py-3">
			<div className="flex items-center gap-2 font-mono text-sm font-semibold text-(--text-primary)">
				<GitCommitHorizontal className="size-4 text-(--accent)" />
				<span>Commits in {version}</span>
				<span className="rounded-full bg-(--surface-selected) px-2.5 py-0.5 text-xs text-(--text-secondary)">
					{count}
				</span>
			</div>
			<a
				href={commitsUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="font-mono text-xs text-(--accent) underline underline-offset-4 hover:text-(--accent-hover)"
			>
				Full commit history on GitHub
			</a>
		</div>
	);
}

/**
 * Renders the expandable list of GitHub commits for a specific release tag.
 */
export function ShowReleaseCommits(props: ShowReleaseCommitsProps): ReactElement | null {
	const [isExpanded, setIsExpanded] = useState(false);
	if (props.commits.length === 0) return null;
	const visible = isExpanded ? props.commits : props.commits.slice(0, INITIAL_LIMIT);
	const hiddenCount = props.commits.length - INITIAL_LIMIT;

	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-(--border) bg-(--surface-raised)">
			<RenderCommitsHeader
				version={props.version}
				count={props.commits.length}
				commitsUrl={props.commitsUrl}
			/>
			<ul className="m-0 flex list-none flex-col divide-y divide-(--border) p-0">
				{visible.map((c) => (
					<RenderCommitRow key={`${props.version}-${c.sha}`} commit={c} />
				))}
			</ul>
			{hiddenCount > 0 ? (
				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) bg-(--rw-code-head) px-4 sm:px-5 py-3">
					<span className="font-mono text-xs text-(--text-secondary)">
						Showing {visible.length} of {props.commits.length} commits
					</span>
					<button
						type="button"
						onClick={() => setIsExpanded((v) => !v)}
						className="font-mono text-xs text-(--accent) underline underline-offset-4 hover:text-(--accent-hover)"
					>
						{isExpanded ? "Show fewer commits" : `Show ${hiddenCount} more commits`}
					</button>
				</div>
			) : null}
		</div>
	);
}
