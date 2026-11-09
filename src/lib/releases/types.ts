// src/lib/releases/types.ts
export interface ReleaseHighlight {
	readonly id: string;
	readonly type: "Added" | "Changed" | "Fixed" | "Security";
	readonly text: string;
}

export interface ReleaseCommit {
	readonly sha: string;
	readonly shortSha: string;
	readonly message: string;
	readonly date: string;
	readonly author: string;
	readonly url: string;
}

export interface ReleaseEntry {
	readonly version: string;
	readonly name: string;
	readonly date: string;
	readonly url: string;
	readonly commitsUrl: string;
	readonly channel: string;
	readonly latest: boolean;
	readonly summary: string;
	readonly highlights: readonly ReleaseHighlight[];
	readonly commits: readonly ReleaseCommit[];
}

export interface GithubReleasePayload {
	readonly tag_name: string;
	readonly name: string | null;
	readonly published_at: string | null;
	readonly html_url: string;
	readonly prerelease: boolean;
	readonly body: string | null;
}

export interface GithubCommitPayload {
	readonly sha: string;
	readonly html_url: string;
	readonly commit: {
		readonly message: string;
		readonly author?: {
			readonly name?: string;
			readonly date?: string;
		};
	};
	readonly author?: {
		readonly login?: string;
	} | null;
}

export const GITHUB_REPO = "ianramy/rustywoof";
