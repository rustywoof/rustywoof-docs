// src/components/ui/show-grouped-cli-tabs.tsx
"use client";

import { type ReactElement, useState } from "react";
import { type CliTabGroup, ShowCliTabBar } from "./show-cli-tab-bar";
import { ShowCopyButton } from "./show-copy-button";

/**
 * Tokenizes a single CLI command line into binary, flag, and argument spans.
 */
function RenderCommandLine({ line }: { readonly line: string }): ReactElement {
	const rawTokens = line.split(" ");
	let cursor = 0;
	const keyed = rawTokens.map((tok, idx) => {
		const id = `${cursor}:${tok}`;
		cursor += tok.length + 1;
		const cls = idx === 0 ? "rw-tok-bin" : tok.startsWith("-") ? "rw-tok-flag" : "rw-tok-arg";
		return { id, tok, cls, hasSpace: idx < rawTokens.length - 1 };
	});
	return (
		<>
			{keyed.map((item) => (
				<span key={item.id} className={item.cls}>
					{item.tok}
					{item.hasSpace ? " " : ""}
				</span>
			))}
		</>
	);
}

/**
 * Renders the active CLI command panel with wrapped lines and zero scrollbars.
 */
function RenderTerminalBlock({
	command,
	caption,
}: {
	readonly command: string;
	readonly caption?: string | undefined;
}): ReactElement {
	return (
		<div className="rw-animate-in flex w-full flex-col bg-(--rw-code-bg)" role="tabpanel">
			<div className="flex items-start justify-between gap-3 px-5 py-4">
				<pre className="m-0 min-w-0 flex-1 whitespace-pre-wrap wrap-break-word font-mono text-sm sm:text-base leading-relaxed">
					<code className="block w-full">
						<span className="mr-2.5 select-none text-(--rw-code-muted)">$</span>
						<RenderCommandLine line={command} />
					</code>
				</pre>
				<ShowCopyButton text={command} />
			</div>
			{caption ? <p className="m-0 px-5 pb-4 text-sm text-(--rw-code-muted)">{caption}</p> : null}
		</div>
	);
}

interface ShowGroupedCliTabsProps {
	readonly groups: readonly CliTabGroup[];
}

/**
 * Renders a two-tier ecosystem and package-manager terminal tab window.
 */
export function ShowGroupedCliTabs({ groups }: ShowGroupedCliTabsProps): ReactElement | null {
	const [groupId, setGroupId] = useState<string>(groups[0]?.id ?? "");
	const [picked, setPicked] = useState<Readonly<Record<string, string>>>({});
	const group = groups.find((g) => g.id === groupId) ?? groups[0];
	if (!group) return null;
	const current = group.items.find((i) => i.id === picked[group.id]) ?? group.items[0];
	if (!current) return null;

	return (
		<div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) text-base shadow-(--rw-window-shadow)">
			<ShowCliTabBar items={groups} activeId={group.id} onSelect={setGroupId} />
			<ShowCliTabBar
				items={group.items}
				activeId={current.id}
				onSelect={(id) => setPicked((prev) => ({ ...prev, [group.id]: id }))}
				sub
			/>
			<RenderTerminalBlock
				key={`${group.id}-${current.id}`}
				command={current.command}
				caption={current.caption}
			/>
		</div>
	);
}
