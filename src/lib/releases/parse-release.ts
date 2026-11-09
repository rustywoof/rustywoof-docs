// src/lib/releases/parse-release.ts
import type { ReleaseHighlight } from "./types";

/**
 * Formats an ISO-8601 release or commit timestamp into a short human-readable date.
 */
export function formatReleaseDate(iso: string | null | undefined): string {
	if (!iso) return "Recent";
	try {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC",
		}).format(new Date(iso));
	} catch {
		return "Recent";
	}
}

/**
 * Classifies a markdown bullet point into an Added, Changed, or Fixed highlight item.
 */
function classifyHighlight(clean: string, id: string): ReleaseHighlight {
	if (/^added:/i.test(clean)) {
		return { id, type: "Added", text: clean.replace(/^added:\s*/i, "") };
	}
	if (/^changed:/i.test(clean)) {
		return { id, type: "Changed", text: clean.replace(/^changed:\s*/i, "") };
	}
	if (/^fixed:/i.test(clean)) {
		return { id, type: "Fixed", text: clean.replace(/^fixed:\s*/i, "") };
	}
	return { id, type: "Added", text: clean };
}

/**
 * Extracts a summary line and deduplicated highlights from a GitHub release Markdown body.
 */
export function parseBodyToHighlights(
	body: string,
	version: string,
): { readonly summary: string; readonly highlights: ReleaseHighlight[] } {
	const lines = body
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);

	let summary = "Release binary and rule dictionary updated on GitHub Releases.";
	const highlights: ReleaseHighlight[] = [];
	const seenTexts = new Set<string>();

	for (const [idx, line] of lines.entries()) {
		if (line.startsWith("#")) continue;
		if (line.startsWith("-") || line.startsWith("*")) {
			const clean = line
				.replace(/^[-*]\s*/, "")
				.replace(/\*\*/g, "")
				.trim();
			if (!clean || seenTexts.has(clean)) continue;
			seenTexts.add(clean);
			highlights.push(classifyHighlight(clean, `${version}-hl-${idx}`));
		} else if (summary.startsWith("Release binary")) {
			summary = line.replace(/\*\*/g, "");
		}
	}

	return { summary, highlights };
}
