// src/components/render-osv-json-code-block.tsx
import type { ReactElement } from "react";
import { RenderHighlight, ShowCopyButton } from "@/components/ui";

interface RenderOsvJsonCodeBlockProps {
	readonly payload: string;
}

/**
 * Renders the syntax-highlighted OSV JSON request body without scrollbars.
 */
export function RenderOsvJsonCodeBlock({ payload }: RenderOsvJsonCodeBlockProps): ReactElement {
	let offset = 0;
	const keyedLines = payload.split("\n").map((line) => {
		const id = `osv-${offset}-${line}`;
		offset += line.length + 1;
		return { id, line };
	});
	return (
		<div className="flex items-start justify-between gap-3 border-t border-(--rw-code-border) px-5 py-4">
			<pre className="m-0 min-w-0 flex-1 whitespace-pre-wrap wrap-break-word font-mono text-sm sm:text-base leading-relaxed">
				<code>
					{keyedLines.map((item) => (
						<span key={item.id} className="block w-full whitespace-pre-wrap wrap-break-word">
							<RenderHighlight text={item.line} lang="json" />
						</span>
					))}
				</code>
			</pre>
			<ShowCopyButton text={payload} />
		</div>
	);
}
