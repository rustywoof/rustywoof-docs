// src/components/playground/show-workbench-panels.tsx
"use client";

import type { ReactElement } from "react";
import type { TerminalLine } from "@/components";
import type { PlaygroundMode } from "@/lib";
import { type EditorPaneProps, RenderEditorPane } from "./render-editor-pane";
import { RenderOutputPane } from "./render-output-pane";

interface ShowWorkbenchPanelsProps {
	readonly editor: EditorPaneProps;
	readonly mode: PlaygroundMode;
	readonly isBusy: boolean;
	readonly lines: readonly TerminalLine[];
}

/**
 * Renders the side-by-side playground editor and sticky scrollable terminal output windows.
 */
export function ShowWorkbenchPanels({
	editor,
	mode,
	isBusy,
	lines,
}: ShowWorkbenchPanelsProps): ReactElement {
	return (
		<div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2">
			<RenderEditorPane editor={editor} />
			<RenderOutputPane editor={editor} mode={mode} isBusy={isBusy} lines={lines} />
		</div>
	);
}
