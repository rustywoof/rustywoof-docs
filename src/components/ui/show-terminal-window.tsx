// src/components/ui/show-terminal-window.tsx
import type { ReactElement } from "react";
import { RenderTerminalLines, type TerminalLine } from "../render-terminal-lines";
import { ShowCopyButton } from "./show-copy-button";
import { ShowEcosystemIcon } from "./show-ecosystem-icon";

interface ShowTerminalWindowProps {
	readonly label?: string | undefined;
	readonly title?: string | undefined;
	readonly icon?: string | undefined;
	readonly lines: readonly TerminalLine[];
}

/**
 * Renders a uniform terminal output window with brand logo chrome and zero scrollbars.
 */
export function ShowTerminalWindow({
	label,
	title,
	icon = "bash",
	lines,
}: ShowTerminalWindowProps): ReactElement {
	const rawText = lines.map((line) => line.text).join("\n");
	const headerTitle = title ?? (label ? undefined : "woof terminal");

	return (
		<div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) text-(--rw-code-text) shadow-(--rw-window-shadow)">
			<div className="flex items-center justify-between gap-3 border-b border-(--rw-code-border) bg-(--rw-code-head) px-4 py-2.5">
				<div className="flex min-w-0 items-center gap-2.5 font-mono text-sm text-(--rw-code-muted)">
					<ShowEcosystemIcon kind={icon} />
					{label ? <span className="font-semibold text-(--text-primary)">{label}</span> : null}
					{headerTitle ? (
						<span className="truncate text-(--text-primary)">{headerTitle}</span>
					) : null}
				</div>
				<ShowCopyButton text={rawText} />
			</div>
			<RenderTerminalLines lines={lines} />
		</div>
	);
}
