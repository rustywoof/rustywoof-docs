// src/lib/github-releases.ts
import {
	FALLBACK_COMMITS,
	FALLBACK_RELEASES,
	formatReleaseDate,
	GITHUB_REPO,
	type GithubCommitPayload,
	type GithubReleasePayload,
	parseBodyToHighlights,
	type ReleaseCommit,
	type ReleaseEntry,
	type ReleaseHighlight,
} from "./releases";

export type { ReleaseCommit, ReleaseEntry, ReleaseHighlight };

/**
 * Fetches recent GitHub commits for a given release tag, falling back to local commit metadata.
 */
async function fetchCommitsForTag(tag: string): Promise<readonly ReleaseCommit[]> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO}/commits?sha=${encodeURIComponent(tag)}&per_page=30`,
			{
				headers: { Accept: "application/vnd.github+json" },
				next: { revalidate: 3600 },
			},
		);
		if (!res.ok) return FALLBACK_COMMITS;
		const data = (await res.json()) as GithubCommitPayload[];
		if (!Array.isArray(data) || data.length === 0) return FALLBACK_COMMITS;

		return data.map((c) => {
			const firstLine = (c.commit?.message ?? "").split(/\r?\n/)[0]?.trim() || "Update repository";
			return {
				sha: c.sha,
				shortSha: c.sha.slice(0, 7),
				message: firstLine,
				date: formatReleaseDate(c.commit?.author?.date),
				author: c.author?.login || c.commit?.author?.name || "ianramy",
				url: c.html_url || `https://github.com/${GITHUB_REPO}/commit/${c.sha}`,
			};
		});
	} catch {
		return FALLBACK_COMMITS;
	}
}

/**
 * Maps a raw GitHub release payload and its tag commits into a structured ReleaseEntry.
 */
async function mapGithubRelease(rel: GithubReleasePayload, idx: number): Promise<ReleaseEntry> {
	const { summary, highlights } = parseBodyToHighlights(rel.body ?? "", rel.tag_name);
	const commits = await fetchCommitsForTag(rel.tag_name);
	return {
		version: rel.tag_name,
		name: rel.name || `Rustywoof ${rel.tag_name}`,
		date: formatReleaseDate(rel.published_at),
		url: rel.html_url,
		commitsUrl: `https://github.com/${GITHUB_REPO}/commits/${rel.tag_name}`,
		channel: idx === 0 ? "Latest Stable" : rel.prerelease ? "Pre-release" : "Stable",
		latest: idx === 0,
		summary,
		highlights:
			highlights.length > 0
				? highlights
				: [
						{
							id: `${rel.tag_name}-default`,
							type: "Added",
							text: `Published ${rel.tag_name} release artifacts.`,
						},
					],
		commits,
	};
}

/**
 * Fetches the Rustywoof release history from GitHub with deterministic fallback entries.
 */
export async function getGithubReleases(): Promise<readonly ReleaseEntry[]> {
	try {
		const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
			headers: { Accept: "application/vnd.github+json" },
			next: { revalidate: 3600 },
		});
		if (!res.ok) return FALLBACK_RELEASES;
		const data = (await res.json()) as GithubReleasePayload[];
		if (!Array.isArray(data) || data.length === 0) return FALLBACK_RELEASES;
		return await Promise.all(data.map((rel, idx) => mapGithubRelease(rel, idx)));
	} catch {
		return FALLBACK_RELEASES;
	}
}

/**
 * Resolves the latest published Rustywoof version tag.
 */
export async function getLatestVersionTag(): Promise<string> {
	const releases = await getGithubReleases();
	return releases[0]?.version ?? "v0.3.0";
}
