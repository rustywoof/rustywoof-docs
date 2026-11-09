// src/lib/releases/index.ts
export { FALLBACK_COMMITS } from "./fallback-commits";
export { FALLBACK_RELEASES } from "./fallback-releases";
export { formatReleaseDate, parseBodyToHighlights } from "./parse-release";
export {
	GITHUB_REPO,
	type GithubCommitPayload,
	type GithubReleasePayload,
	type ReleaseCommit,
	type ReleaseEntry,
	type ReleaseHighlight,
} from "./types";
