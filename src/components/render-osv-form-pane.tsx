// src/components/render-osv-form-pane.tsx
import type { ReactElement } from "react";

interface RenderOsvFormPaneProps {
	readonly lockfile: string;
	readonly pkg: string;
	readonly version: string;
	readonly onPkg: (val: string) => void;
	readonly onVersion: (val: string) => void;
}

/**
 * Renders the package name and version inputs for the OSV batch query preview.
 */
export function RenderOsvFormPane(props: RenderOsvFormPaneProps): ReactElement {
	return (
		<div className="flex flex-col gap-4 px-5 pt-5 pb-3">
			<div className="text-base text-(--text-secondary)">
				<strong className="block text-(--text-primary)">Local OSV Batch Query</strong>
				<code>woof audit</code> reads package names and versions from <code>{props.lockfile}</code>.
				Source files and local paths stay on your machine.
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_9rem]">
				<input
					type="text"
					value={props.pkg}
					onChange={(e) => props.onPkg(e.target.value)}
					aria-label="Package name"
					className="rounded-lg border border-(--rw-code-border) bg-(--surface) px-3.5 py-2 font-mono text-sm text-(--text-primary)"
				/>
				<input
					type="text"
					value={props.version}
					onChange={(e) => props.onVersion(e.target.value)}
					aria-label="Package version"
					className="rounded-lg border border-(--rw-code-border) bg-(--surface) px-3.5 py-2 font-mono text-sm text-(--text-primary)"
				/>
			</div>
		</div>
	);
}
