// src/components/playground/render-output-pane.tsx
"use client";

import type { ReactElement } from "react";
import { RenderTerminalLines, type TerminalLine } from "@/components";
import { ShowCopyButton, ShowEcosystemIcon } from "@/components/ui";
import type { PlaygroundMode } from "@/lib";
import { MODES } from "./playground-data";
import type { EditorPaneProps } from "./render-editor-pane";

interface OutputPaneProps {
	readonly editor: EditorPaneProps;
	readonly mode: PlaygroundMode;
	readonly isBusy: boolean;
	readonly lines: readonly TerminalLine[];
}

/**
 * Renders the sticky, internally scrollable terminal output window matching the editor height.
 */
export function RenderOutputPane({ editor, mode, isBusy, lines }: OutputPaneProps): ReactElement {
	const rawText = lines.map((l) => l.text).join("\n");
	const cmd = MODES.find((m) => m.id === mode)?.cmd ?? "woof";

	return (
		<div className="flex h-112 sm:h-136 lg:sticky lg:top-24 lg:h-[calc(100vh-14rem)] lg:min-h-136 lg:max-h-208 flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) shadow-(--rw-window-shadow)">
			<div className="flex shrink-0 items-center justify-between gap-3 border-b border-(--rw-code-border) bg-(--rw-code-head) px-4 py-2.5 font-mono text-sm text-(--rw-code-muted)">
				<div className="flex min-w-0 items-center gap-2.5">
					<ShowEcosystemIcon kind="bash" />
					<span className="truncate text-(--text-primary)">{cmd}</span>
					<span className="rounded border border-(--rw-code-border) bg-(--surface) px-2 py-0.5 text-[11px] uppercase tracking-wider text-(--text-secondary)">
						{isBusy ? "Running..." : "Ready"}
					</span>
				</div>
				<ShowCopyButton text={rawText} />
			</div>
			{!editor.inputText ? (
				<div className="flex shrink-0 items-center gap-2 border-b border-(--rw-code-border) bg-(--surface-raised) px-4 py-2 text-xs">
					<span className="text-(--text-secondary)">No buffer loaded:</span>
					<button
						type="button"
						onClick={editor.loadSample}
						className="font-medium text-(--accent) hover:underline"
					>
						Run sample
					</button>
					<span className="text-(--text-secondary)">or paste on left</span>
				</div>
			) : null}
			<div
				data-lenis-prevent
				className="relative flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-auto"
			>
				<RenderTerminalLines lines={lines} />
			</div>
		</div>
	);
}
