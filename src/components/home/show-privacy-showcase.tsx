// src/components/home/show-privacy-showcase.tsx
import type { ReactElement } from "react";
import { ShowOsvPayloadPreview } from "@/components";
import { RenderFeatureRow } from "./render-feature-row";

/**
 * Renders the local-execution privacy showcase with interactive OSV payload preview.
 */
export function ShowPrivacyShowcase(): ReactElement {
	return (
		<RenderFeatureRow
			reverse
			eyebrow="Privacy · local execution"
			title="Your code never leaves your machine."
			description="The only network call Rustywoof ever makes is a batch lookup to api.osv.dev containing package names and version numbers. File paths, environment variables, and source code stay on your disk."
			detail="Edit the package name or version in the inspector to see the exact JSON body sent during an audit."
			cta={{ label: "Try the playground", href: "/playground" }}
		>
			<ShowOsvPayloadPreview />
		</RenderFeatureRow>
	);
}
