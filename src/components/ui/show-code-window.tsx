// src/components/ui/show-code-window.tsx
import type { ReactElement } from "react";
import { detectLangFromFilename } from "./detect-lang-from-filename";
import type { Lang } from "./highlight-rules";
import { RenderHighlight } from "./render-highlight";
import { ShowCopyButton } from "./show-copy-button";
import { ShowEcosystemIcon } from "./show-ecosystem-icon";

export interface CodeLine {
	readonly line: number;
	readonly text: string;
	readonly danger?: boolean;
}

interface ShowCodeWindowProps {
	readonly filename: string;
	readonly icon?: string;
	readonly badge?: string;
	readonly label?: string;
	readonly lang?: Lang;
	readonly hideHeader?: boolean;
	readonly lines: readonly CodeLine[];
}

/**
 * Resolves the default brand icon key from a filename or language identifier.
 */
function resolveWindowIcon(filename: string, lang: Lang, icon?: string): string | undefined {
	if (icon) return icon;
	if (lang === "ts") return "ts";
	if (lang === "rust") return "rust";
	if (lang === "python") return "python";
	if (lang === "toml") return "toml";
	if (lang === "json") return "json";
	if (filename.endsWith(".sh")) return "bash";
	return undefined;
}

/**
 * Renders the top header bar of a CodeWindow with brand icon, filename, badge, and copy button.
 */
function RenderCodeWindowHeader({
	icon,
	label,
	filename,
	badge,
	rawCode,
}: {
	readonly icon?: string | undefined;
	readonly label?: string | undefined;
	readonly filename: string;
	readonly badge?: string | undefined;
	readonly rawCode: string;
}): ReactElement {
	return (
		<div className="flex items-center justify-between gap-3 border-b border-(--rw-code-border) bg-(--rw-code-head) px-4 py-2.5">
			<div className="flex min-w-0 items-center gap-2.5 font-mono text-sm text-(--rw-code-muted)">
				<ShowEcosystemIcon kind={icon} />
				{label ? <span className="font-semibold text-(--text-primary)">{label}</span> : null}
				{filename ? <span className="truncate text-(--text-primary)">{filename}</span> : null}
				{badge ? (
					<span className="rounded border border-(--rw-code-border) bg-(--surface) px-2 py-0.5 text-[11px] uppercase tracking-wider text-(--text-secondary)">
						{badge}
					</span>
				) : null}
			</div>
			<ShowCopyButton text={rawCode} />
		</div>
	);
}

/**
 * Renders a syntax-highlighted code window with wrapped lines and zero scrollbars.
 */
export function ShowCodeWindow(props: ShowCodeWindowProps): ReactElement {
	const language = props.lang ?? detectLangFromFilename(props.filename);
	const resolvedIcon = resolveWindowIcon(props.filename, language, props.icon);
	const rawCode = props.lines.map((item) => item.text).join("\n");

	return (
		<div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) text-(--rw-code-text) shadow-(--rw-window-shadow)">
			{props.hideHeader ? null : (
				<RenderCodeWindowHeader
					icon={resolvedIcon}
					label={props.label}
					filename={props.filename}
					badge={props.badge}
					rawCode={rawCode}
				/>
			)}
			<div className="flex flex-col py-4 font-mono text-sm lg:text-base leading-relaxed">
				{props.lines.map((item) => (
					<span
						key={`${props.filename}-${item.line}`}
						className={`block w-full whitespace-pre-wrap wrap-break-word px-5 ${
							item.danger ? "bg-(--rw-code-danger-bg) shadow-(--rw-code-danger-shadow)" : ""
						}`}
					>
						{item.text ? <RenderHighlight text={item.text} lang={language} /> : "\u00A0"}
					</span>
				))}
			</div>
		</div>
	);
}
