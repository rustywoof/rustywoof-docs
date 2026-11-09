// src/components/playground/show-playground-toolbar.tsx
"use client";

import { FolderOpen, Play, RotateCcw, ShieldAlert } from "lucide-react";
import type { ReactElement, RefObject } from "react";
import { ShowActionButton } from "@/components/ui";
import type { PlaygroundMode } from "@/lib";
import { MODES } from "./playground-data";

interface ShowPlaygroundToolbarProps {
	readonly mode: PlaygroundMode;
	readonly switchMode: (m: PlaygroundMode) => void;
	readonly fileInputRef: RefObject<HTMLInputElement | null>;
	readonly onUpload: (file: File) => void;
	readonly onReset: () => void;
	readonly onLoadSample?: (() => void) | undefined;
	readonly onClearInput?: (() => void) | undefined;
	readonly hasInput?: boolean | undefined;
	readonly onRunAudit?: (() => void) | undefined;
	readonly isBusy?: boolean | undefined;
}

/**
 * Renders the mode-switching tab bar for secret scanning, lockfile audit, and graph tracing.
 */
function RenderModeTabBar({
	mode,
	switchMode,
}: {
	readonly mode: PlaygroundMode;
	readonly switchMode: (m: PlaygroundMode) => void;
}): ReactElement {
	return (
		<div className="flex flex-wrap items-center gap-1.5" role="tablist">
			{MODES.map((m) => (
				<ShowActionButton
					key={m.id}
					id={`mode:${m.id}`}
					role="tab"
					ariaSelected={mode === m.id}
					active={mode === m.id}
					onClick={() => switchMode(m.id)}
				>
					{m.label}
				</ShowActionButton>
			))}
		</div>
	);
}

/**
 * Renders the mode tabs, file upload trigger, and explicit audit execution button.
 */
export function ShowPlaygroundToolbar(props: ShowPlaygroundToolbarProps): ReactElement {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<RenderModeTabBar mode={props.mode} switchMode={props.switchMode} />
			<div className="flex flex-wrap items-center gap-2.5">
				{props.mode === "audit" && props.onRunAudit && props.hasInput ? (
					<button
						type="button"
						onClick={props.onRunAudit}
						disabled={props.isBusy}
						className="rw-pill rw-pill-primary rw-pill-sm font-semibold"
					>
						<ShieldAlert className="size-4" />
						<span>{props.isBusy ? "Auditing..." : "Run Audit"}</span>
					</button>
				) : null}
				<input
					ref={props.fileInputRef}
					type="file"
					accept=".json,.lock,.toml,.txt,.yaml,.yml,.ts,.js,.rs,.py"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) props.onUpload(file);
						e.target.value = "";
					}}
					className="hidden"
				/>
				<button
					type="button"
					onClick={() => props.fileInputRef.current?.click()}
					className="rw-pill rw-pill-soft rw-pill-sm"
				>
					<FolderOpen className="size-4 text-(--accent)" />
					<span>Open File / Manifest</span>
				</button>
				{props.hasInput ? (
					<button
						type="button"
						onClick={props.onClearInput ?? props.onReset}
						className="rw-pill rw-pill-soft rw-pill-sm"
					>
						<RotateCcw className="size-3.5" />
						<span>Insert Here</span>
					</button>
				) : (
					<button
						type="button"
						onClick={props.onLoadSample ?? props.onReset}
						className="rw-pill rw-pill-primary rw-pill-sm font-semibold"
					>
						<Play className="size-3.5" />
						<span>Run Samples</span>
					</button>
				)}
			</div>
		</div>
	);
}
