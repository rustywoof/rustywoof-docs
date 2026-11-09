// src/components/show-page-actions.tsx
"use client";

import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { Check, ChevronDown, Copy } from "lucide-react";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { copyText } from "@/components/ui";

interface ShowPageActionsProps {
	readonly markdownPath: string;
	readonly githubUrl: string;
}

const ITEM =
	"flex w-full items-center rounded-lg px-3 py-2 text-sm text-(--text-primary) no-underline hover:bg-(--surface-hover)";

/**
 * Builds the external inspection links for the current documentation page.
 */
function buildActionLinks(
	origin: string,
	markdownPath: string,
	githubUrl: string,
): readonly { readonly label: string; readonly href: string }[] {
	const prompt = encodeURIComponent(
		`Read ${origin}${markdownPath}, I want to ask questions about it.`,
	);
	return [
		{ label: "View as Markdown", href: markdownPath },
		{ label: "Open in GitHub", href: githubUrl },
		{ label: "Open in ChatGPT", href: `https://chatgpt.com/?hints=search&q=${prompt}` },
		{ label: "Open in Claude", href: `https://claude.ai/new?q=${prompt}` },
	];
}

/**
 * Fetches and caches the raw Markdown route for clipboard copying.
 */
function useMarkdownCopier(markdownPath: string): {
	readonly copied: boolean;
	readonly busy: boolean;
	readonly copyMarkdown: () => Promise<void>;
} {
	const [copied, setCopied] = useState(false);
	const [busy, setBusy] = useState(false);
	const cache = useRef<string | null>(null);

	const copyMarkdown = async (): Promise<void> => {
		setBusy(true);
		try {
			if (cache.current === null) {
				const res = await fetch(markdownPath);
				if (!res.ok) throw new Error(String(res.status));
				cache.current = await res.text();
			}
			if (await copyText(cache.current)) {
				setCopied(true);
				setTimeout(() => setCopied(false), 1800);
			}
		} catch {
			// Why: Network or clipboard failure leaves the button in its idle state without throwing in the UI.
		} finally {
			setBusy(false);
		}
	};

	return { copied, busy, copyMarkdown };
}

/**
 * Renders the "Copy Markdown" pill and "Open" dropdown for documentation pages.
 */
export function ShowPageActions({ markdownPath, githubUrl }: ShowPageActionsProps): ReactElement {
	const { copied, busy, copyMarkdown } = useMarkdownCopier(markdownPath);
	const [origin, setOrigin] = useState("");
	useEffect(() => setOrigin(window.location.origin), []);
	const links = buildActionLinks(origin, markdownPath, githubUrl);
	const Icon = copied ? Check : Copy;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onClick={copyMarkdown}
				disabled={busy}
				className="rw-pill rw-pill-soft rw-pill-sm disabled:opacity-60"
			>
				<Icon className="size-4" aria-hidden="true" />
				{copied ? "Copied" : "Copy Markdown"}
			</button>
			<Popover>
				<PopoverTrigger className="rw-pill rw-pill-soft rw-pill-sm">
					Open
					<ChevronDown className="size-4" aria-hidden="true" />
				</PopoverTrigger>
				<PopoverContent className="flex w-56 flex-col gap-0.5 p-1.5">
					{links.map((item) => (
						<a
							key={item.label}
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className={ITEM}
						>
							{item.label}
						</a>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
}
