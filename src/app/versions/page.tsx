// src/app/versions/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ShowReleaseTimelineItem } from "@/components";
import { ShowActionLink, ShowGithubBrandIcon, ShowTerminalWindow } from "@/components/ui";
import { getGithubReleases } from "@/lib";

export const metadata: Metadata = {
	title: "Releases & Changelog | Rustywoof",
	description:
		"Release history, commit logs, security updates, and binary upgrades fetched from GitHub.",
};

/**
 * Renders the top header for the Releases & Changelog page.
 */
function RenderVersionsHeader({ latest }: { readonly latest: string }): ReactElement {
	return (
		<header className="flex flex-col justify-between gap-6 border-b border-(--border) pb-10 lg:flex-row lg:items-end">
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center gap-3">
					<span className="font-mono text-sm font-semibold uppercase tracking-widest text-(--accent)">
						Changelog
					</span>
					<span className="rounded-full border border-(--border-strong) bg-(--surface-raised) px-3 py-0.5 font-mono text-xs font-semibold text-(--success)">
						Latest: {latest}
					</span>
				</div>
				<h1 className="m-0 text-4xl sm:text-5xl font-bold tracking-tight text-(--text-primary)">
					Releases &amp; Changelog
				</h1>
				<p className="m-0 max-w-2xl text-lg sm:text-xl leading-relaxed text-(--text-secondary)">
					New secret rules, lockfile parsers, and tag commit history across every Rustywoof release.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<ShowActionLink
					href="https://github.com/ianramy/rustywoof/releases"
					external
					variant="primary"
				>
					<ShowGithubBrandIcon />
					<span>GitHub Releases</span>
				</ShowActionLink>
				<ShowActionLink href="/docs/cli/update">Upgrade Guide</ShowActionLink>
			</div>
		</header>
	);
}

/**
 * Renders the Releases & Changelog page with self-update terminal and release timeline.
 */
export default async function VersionsPage(): Promise<ReactElement> {
	const releases = await getGithubReleases();
	const latest = releases[0]?.version ?? "v0.3.0";

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-6">
			<RenderVersionsHeader latest={latest} />
			<ShowTerminalWindow
				icon="rust"
				label="Self-Update"
				title="Upgrade your local Rustywoof binary to the latest release"
				lines={[
					{ id: "u1", text: "$ woof update", tone: "accent" },
					{
						id: "u2",
						text: "Fetching latest release from github.com/ianramy/rustywoof...",
						tone: "muted",
					},
					{
						id: "u3",
						text: `✓ Already up to date (woof ${latest.replace(/^v/, "")}).`,
						tone: "success",
					},
				]}
			/>
			<div className="flex flex-col">
				{releases.map((rel) => (
					<ShowReleaseTimelineItem key={rel.version} rel={rel} />
				))}
			</div>
		</div>
	);
}
