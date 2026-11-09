// src/components/show-release-banner.tsx
"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { ShowBanner } from "./show-banner";

interface ShowReleaseBannerProps {
	readonly version: string;
}

/**
 * Renders the top release announcement banner with version badge and changelog link.
 */
export function ShowReleaseBanner({ version }: ShowReleaseBannerProps): ReactElement {
	return (
		<ShowBanner id={`rustywoof-release-${version}`}>
			<span className="rounded-full bg-(--accent) px-2.5 py-0.5 font-mono text-xs font-semibold text-(--on-accent)">
				{version}
			</span>
			<span>
				Rustywoof {version} is out — local OSV lockfile auditing and browser WASM secret scanning.
			</span>
			<Link
				href="/versions"
				className="font-semibold text-(--accent) underline underline-offset-4 transition-colors hover:text-(--accent-hover)"
			>
				Read the release notes
			</Link>
		</ShowBanner>
	);
}
