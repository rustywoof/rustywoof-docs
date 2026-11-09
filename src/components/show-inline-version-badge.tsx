// src/components/show-inline-version-badge.tsx
import type { ReactElement } from "react";

interface ShowInlineVersionBadgeProps {
	readonly added?: string | undefined;
	readonly deprecated?: string | undefined;
}

/**
 * Renders inline semantic version badges indicating when a CLI flag was added or deprecated.
 */
export function ShowInlineVersionBadge({
	added,
	deprecated,
}: ShowInlineVersionBadgeProps): ReactElement {
	return (
		<span className="ml-2 inline-flex items-center gap-2 align-middle">
			{added ? (
				<span className="rounded border border-(--success)/30 bg-(--success)/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-(--success)">
					Added {added}
				</span>
			) : null}
			{deprecated ? (
				<span className="rounded border border-(--danger)/30 bg-(--danger)/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-(--danger)">
					Deprecated {deprecated}
				</span>
			) : null}
		</span>
	);
}
