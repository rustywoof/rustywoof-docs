// src/components/show-playground.tsx
"use client";

import { type ReactElement, useRef, useState } from "react";
import {
	ShowAuditDropzoneCallout,
	ShowPlaygroundToolbar,
	ShowWorkbenchPanels,
	usePlaygroundFileState,
	usePlaygroundRunner,
} from "./playground";

/**
 * Renders the package filter input for dependency graph tracing mode.
 */
function RenderSniffFilterInput({
	value,
	onChange,
}: {
	readonly value: string;
	readonly onChange: (v: string) => void;
}): ReactElement {
	return (
		<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
			<label
				htmlFor="sniff-pkg-filter"
				className="font-mono text-sm uppercase tracking-wider text-(--text-secondary)"
			>
				Filter package:
			</label>
			<input
				id="sniff-pkg-filter"
				type="text"
				placeholder="e.g. lodash, hyper, django (leave blank for full tree)"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full max-w-md rounded-lg border border-(--border) bg-(--surface-raised) px-3.5 py-2 font-mono text-sm text-(--text-primary)"
			/>
		</div>
	);
}

/**
 * Renders the interactive Rustywoof browser playground workbench.
 */
export function ShowPlayground(): ReactElement {
	const state = usePlaygroundFileState();
	const [sniffFilter, setSniffFilter] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const runner = usePlaygroundRunner(state.mode, state.inputText, state.filename, sniffFilter);
	const isLockMode = state.mode === "audit" || state.mode === "sniff";

	return (
		<div className="flex w-full flex-col gap-8">
			<ShowPlaygroundToolbar
				mode={state.mode}
				switchMode={state.switchMode}
				fileInputRef={fileInputRef}
				onUpload={(f) => state.loadUploadedFile(f).catch(() => {})}
				onReset={state.loadSample}
				onLoadSample={state.loadSample}
				onClearInput={state.clearInput}
				hasInput={Boolean(state.inputText.trim())}
				onRunAudit={runner.runAudit}
				isBusy={runner.isBusy}
			/>
			{isLockMode && (
				<ShowAuditDropzoneCallout
					isDragging={state.isDragging}
					setIsDragging={state.setIsDragging}
					onDrop={state.onDrop}
					filename={state.filename}
					onSelectPreset={state.selectPreset}
				/>
			)}
			{state.mode === "sniff" && (
				<RenderSniffFilterInput value={sniffFilter} onChange={setSniffFilter} />
			)}
			<ShowWorkbenchPanels
				editor={state}
				mode={state.mode}
				isBusy={runner.isBusy}
				lines={runner.lines}
			/>
		</div>
	);
}
