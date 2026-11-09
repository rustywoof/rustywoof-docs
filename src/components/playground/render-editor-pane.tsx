// src/components/playground/render-editor-pane.tsx
"use client";

import type { DragEvent, ReactElement } from "react";
import { ShowEcosystemIcon } from "@/components/ui";
import type { PlaygroundMode } from "@/lib";
import { detectEcosystemIcon } from "./playground-data";

export interface EditorPaneProps {
	readonly mode: PlaygroundMode;
	readonly filename: string;
	readonly inputText: string;
	readonly setInputText: (v: string) => void;
	readonly isDragging: boolean;
	readonly setIsDragging: (v: boolean) => void;
	readonly onDrop: (e: DragEvent<HTMLElement>) => void;
	readonly loadSample: () => void;
	readonly clearInput: () => void;
}

/**
 * Renders the editable source and lockfile input window with brand logo chrome.
 */
export function RenderEditorPane({ editor }: { readonly editor: EditorPaneProps }): ReactElement {
	const placeholder =
		editor.mode === "scan"
			? "// Insert or paste code here...\n// Or click 'Run sample' to test secret scanning."
			: "// Insert or paste lockfile here...\n// Or click 'Run sample' to audit dependencies.";

	return (
		<section
			aria-label="Source and lockfile editor"
			onDragOver={(e) => {
				e.preventDefault();
				editor.setIsDragging(true);
			}}
			onDragLeave={() => editor.setIsDragging(false)}
			onDrop={editor.onDrop}
			className={`relative flex h-112 sm:h-136 lg:h-[calc(100vh-14rem)] lg:min-h-136 lg:max-h-208 flex-col overflow-hidden rounded-xl border bg-(--rw-code-bg) shadow-(--rw-window-shadow) transition-colors ${
				editor.isDragging ? "border-(--accent)" : "border-(--rw-code-border)"
			}`}
		>
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-(--rw-code-border) bg-(--rw-code-head) px-4 py-2.5 font-mono text-sm text-(--rw-code-muted)">
				<span className="flex min-w-0 items-center gap-2.5 text-(--text-primary)">
					<ShowEcosystemIcon kind={detectEcosystemIcon(editor.filename)} />
					<span className="truncate">{editor.filename}</span>
				</span>
				<div className="flex items-center gap-2">
					{editor.inputText ? (
						<button
							type="button"
							onClick={editor.clearInput}
							className="text-xs text-(--text-secondary) hover:text-(--text-primary)"
						>
							Insert Here
						</button>
					) : (
						<button
							type="button"
							onClick={editor.loadSample}
							className="text-xs font-semibold text-(--accent) hover:underline"
						>
							Run Sample
						</button>
					)}
				</div>
			</div>
			<textarea
				value={editor.inputText}
				onChange={(e) => editor.setInputText(e.target.value)}
				placeholder={placeholder}
				spellCheck={false}
				data-lenis-prevent
				aria-label="Playground code or lockfile input"
				className="min-h-0 w-full flex-1 resize-none overflow-y-auto bg-(--rw-code-bg) p-4 sm:p-5 font-mono text-sm sm:text-base leading-relaxed text-(--rw-code-text) outline-none"
			/>
		</section>
	);
}
