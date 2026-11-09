// src/components/playground/show-audit-dropzone-callout.tsx
"use client";

import { FileUp } from "lucide-react";
import type { DragEvent, ReactElement } from "react";
import { ShowEcosystemIcon } from "@/components/ui";
import { AUDIT_PRESETS, type AuditPreset } from "./playground-data";

interface ShowAuditDropzoneCalloutProps {
	readonly isDragging: boolean;
	readonly setIsDragging: (v: boolean) => void;
	readonly onDrop: (e: DragEvent<HTMLElement>) => void;
	readonly filename: string;
	readonly onSelectPreset: (preset: AuditPreset) => void;
}

/**
 * Renders ecosystem lockfile preset tabs inside the dropzone callout.
 */
function RenderPresetButtons({
	filename,
	onSelectPreset,
}: {
	readonly filename: string;
	readonly onSelectPreset: (preset: AuditPreset) => void;
}): ReactElement {
	return (
		<div className="flex flex-wrap items-center gap-1" role="tablist">
			{AUDIT_PRESETS.map((preset) => (
				<button
					key={preset.id}
					type="button"
					role="tab"
					aria-selected={filename === preset.label}
					data-active={filename === preset.label}
					onClick={() => onSelectPreset(preset)}
					className="rw-tab rw-tab-sub"
				>
					<ShowEcosystemIcon kind={preset.icon} />
					<span>{preset.label}</span>
				</button>
			))}
		</div>
	);
}

/**
 * Renders the lockfile dropzone banner and ecosystem preset selector.
 */
export function ShowAuditDropzoneCallout(props: ShowAuditDropzoneCalloutProps): ReactElement {
	const borderCls = props.isDragging
		? "border-(--accent) bg-(--surface-selected)/40"
		: "border-(--border-strong) bg-(--surface-raised)";

	return (
		<section
			aria-label="Lockfile dropzone and ecosystem presets"
			onDragOver={(e) => {
				e.preventDefault();
				props.setIsDragging(true);
			}}
			onDragLeave={() => props.setIsDragging(false)}
			onDrop={props.onDrop}
			className={`flex flex-col justify-between gap-4 rounded-xl border-2 border-dashed p-5 transition-colors sm:flex-row sm:items-center ${borderCls}`}
		>
			<div className="flex items-start gap-3.5 sm:items-center">
				<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-(--border) bg-(--surface) text-(--accent)">
					<FileUp className="size-5" />
				</div>
				<div className="flex flex-col gap-0.5">
					<span className="text-base font-semibold text-(--text-primary)">
						Drop a dependency file to audit or click &ldquo;Open Lockfile&rdquo;
					</span>
					<span className="text-sm text-(--text-secondary)">
						Supports Node (<code>package.json</code>), Rust (<code>Cargo.lock</code>), and Python (
						<code>uv.lock</code>, <code>poetry.lock</code>, <code>requirements.txt</code>).
					</span>
				</div>
			</div>
			<RenderPresetButtons filename={props.filename} onSelectPreset={props.onSelectPreset} />
		</section>
	);
}
