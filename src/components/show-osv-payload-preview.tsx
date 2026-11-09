// src/components/show-osv-payload-preview.tsx
"use client";

import { type ReactElement, useState } from "react";
import { ShowActionButton, ShowEcosystemIcon } from "@/components/ui";
import { type EcosystemPreset, OSV_PRESETS } from "./osv-presets";
import { RenderOsvFormPane } from "./render-osv-form-pane";
import { RenderOsvJsonCodeBlock } from "./render-osv-json-code-block";

/**
 * Renders the lockfile preset tab strip for the OSV payload preview.
 */
function RenderOsvTabStrip({
	activeId,
	onSelect,
}: {
	readonly activeId: string;
	readonly onSelect: (preset: EcosystemPreset) => void;
}): ReactElement {
	return (
		<div
			className="flex flex-wrap items-center border-b border-(--rw-code-border) bg-(--rw-code-head) px-3"
			role="tablist"
		>
			{OSV_PRESETS.map((item) => (
				<ShowActionButton
					key={item.id}
					id={`osv:${item.id}`}
					role="tab"
					active={item.id === activeId}
					onClick={() => onSelect(item)}
				>
					<ShowEcosystemIcon kind={item.icon} />
					<span>{item.lockfile}</span>
				</ShowActionButton>
			))}
		</div>
	);
}

/**
 * Renders an interactive OSV batch payload preview across Rust, pnpm, and uv lockfiles.
 */
export function ShowOsvPayloadPreview(): ReactElement | null {
	const [activeId, setActiveId] = useState<string>("cargo");
	const [pkg, setPkg] = useState<string>("hyper");
	const [version, setVersion] = useState<string>("1.4.1");
	const preset = OSV_PRESETS.find((p) => p.id === activeId) ?? OSV_PRESETS[0];
	if (!preset) return null;
	const payload = JSON.stringify(
		{ queries: [{ version, package: { name: pkg, ecosystem: preset.ecosystem } }] },
		null,
		2,
	);
	return (
		<div className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) shadow-(--rw-window-shadow)">
			<RenderOsvTabStrip
				activeId={preset.id}
				onSelect={(item) => {
					setActiveId(item.id);
					setPkg(item.defaultPkg);
					setVersion(item.defaultVersion);
				}}
			/>
			<RenderOsvFormPane
				lockfile={preset.lockfile}
				pkg={pkg}
				version={version}
				onPkg={setPkg}
				onVersion={setVersion}
			/>
			<RenderOsvJsonCodeBlock payload={payload} />
		</div>
	);
}
