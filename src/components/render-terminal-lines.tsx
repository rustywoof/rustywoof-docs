// src/components/render-terminal-lines.tsx
import type { ReactElement } from "react";
import type { TerminalLine } from "./terminal-scenarios";

export type { TerminalLine };

interface RenderTerminalLinesProps {
	readonly lines: readonly TerminalLine[];
}

interface TableRowItem {
	readonly id: string;
	readonly label: string;
	readonly value: string;
	readonly tone: string;
}

type RenderSegment =
	| { readonly kind: "line"; readonly line: TerminalLine }
	| { readonly kind: "table"; readonly id: string; readonly rows: readonly TableRowItem[] };

/**
 * Formats line text with clickable OSV hyperlinks when applicable.
 */
function renderLineContent(text: string): ReactElement | string {
	if (!text) return "\u00A0";
	if (text.startsWith("Learn more at:  https://")) {
		const prefix = "Learn more at:  ";
		const url = text.slice(prefix.length);
		return (
			<>
				<span>{prefix}</span>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="underline decoration-1 underline-offset-2 hover:text-(--accent)"
				>
					{url}
				</a>
			</>
		);
	}
	return text;
}

/**
 * Groups consecutive ASCII box-drawing rows into structured table segments.
 */
function groupTerminalSegments(lines: readonly TerminalLine[]): readonly RenderSegment[] {
	const segments: RenderSegment[] = [];
	let currentRows: TableRowItem[] | null = null;
	let tableId = "";

	for (const line of lines) {
		const t = line.text;
		if (t.startsWith("┌")) {
			currentRows = [];
			tableId = line.id;
			continue;
		}
		if (currentRows !== null) {
			if (t.startsWith("├")) continue;
			if (t.startsWith("└")) {
				segments.push({ kind: "table", id: tableId, rows: currentRows });
				currentRows = null;
				continue;
			}
			if (t.startsWith("│")) {
				const parts = t.split("│");
				const label = (parts[1] ?? "").trim();
				const value = (parts[2] ?? "").trim();
				const prev = currentRows[currentRows.length - 1];
				if (!label && prev) {
					currentRows[currentRows.length - 1] = {
						...prev,
						value: `${prev.value} ${value}`.trim(),
					};
				} else {
					currentRows.push({
						id: line.id,
						label,
						value,
						tone: line.tone ?? "default",
					});
				}
				continue;
			}
			segments.push({ kind: "table", id: tableId, rows: currentRows });
			currentRows = null;
		}
		segments.push({ kind: "line", line });
	}
	if (currentRows !== null && currentRows.length > 0) {
		segments.push({ kind: "table", id: tableId, rows: currentRows });
	}
	return segments;
}

/**
 * Renders terminal lines and structured diagnostic tables with zero broken borders.
 */
export function RenderTerminalLines({ lines }: RenderTerminalLinesProps): ReactElement {
	const hasBoxTable = lines.some((l) => l.text.startsWith("┌"));
	if (!hasBoxTable) {
		return (
			<pre className="m-0 flex-1 whitespace-pre-wrap wrap-break-word px-5 py-4 font-mono text-xs sm:text-sm leading-relaxed text-(--rw-code-text)">
				{lines.map((line) => (
					<span
						key={line.id}
						className={`block w-full whitespace-pre-wrap wrap-break-word rw-tone-${line.tone ?? "default"}`}
					>
						{renderLineContent(line.text)}
					</span>
				))}
			</pre>
		);
	}

	const segments = groupTerminalSegments(lines);
	return (
		<pre className="m-0 flex-1 whitespace-pre-wrap wrap-break-word px-5 py-4 font-mono text-xs sm:text-sm leading-relaxed text-(--rw-code-text)">
			{segments.map((seg) =>
				seg.kind === "line" ? (
					<span
						key={seg.line.id}
						className={`block w-full whitespace-pre-wrap wrap-break-word rw-tone-${seg.line.tone ?? "default"}`}
					>
						{renderLineContent(seg.line.text)}
					</span>
				) : (
					<div
						key={seg.id}
						className="my-1.5 w-full overflow-hidden rounded border border-(--border-strong) bg-(--rw-code-bg)"
					>
						<table className="w-full border-collapse font-mono text-xs sm:text-sm">
							<tbody className="divide-y divide-(--border-strong)">
								{seg.rows.map((r) => (
									<tr key={r.id}>
										<td className="w-28 sm:w-32 shrink-0 whitespace-nowrap border-r border-(--border-strong) px-3 py-1.5 align-top text-(--rw-tone-muted)">
											{r.label}
										</td>
										<td
											className={`whitespace-normal wrap-break-word px-3 py-1.5 align-top rw-tone-${r.tone}`}
										>
											{r.value}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				),
			)}
		</pre>
	);
}
