// src/components/show-release-timeline-item.tsx
import type { ReactElement } from "react";
import type { ReleaseEntry, ReleaseHighlight } from "@/lib";
import { ShowReleaseCommits } from "./show-release-commits";

interface ShowReleaseTimelineItemProps {
	readonly rel: ReleaseEntry;
}

/**
 * Renders the categorized highlight badges and descriptions for a release.
 */
function RenderReleaseHighlightList({
	items,
}: {
	readonly items: readonly ReleaseHighlight[];
}): ReactElement {
	return (
		<div className="rounded-xl border border-(--border) bg-(--surface-raised) p-6">
			<ul className="m-0 flex list-none flex-col gap-4 p-0">
				{items.map((item) => (
					<li
						key={item.id}
						className="flex items-start gap-3.5 text-base sm:text-lg leading-relaxed"
					>
						<span
							className={`mt-1 shrink-0 rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase ${
								item.type === "Added"
									? "bg-(--success)/15 text-(--success)"
									: item.type === "Changed"
										? "bg-(--accent)/15 text-(--accent)"
										: "bg-(--surface-selected) text-(--text-secondary)"
							}`}
						>
							{item.type}
						</span>
						<span className="wrap-break-word text-(--text-primary)">{item.text}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * Renders the sticky left-column version badge and date for a release entry.
 */
function RenderReleaseSidebarMeta({ rel }: { readonly rel: ReleaseEntry }): ReactElement {
	return (
		<div className="flex flex-col items-start gap-2 lg:sticky lg:top-28 lg:self-start">
			<div className="flex flex-wrap items-center gap-2.5">
				<a
					href={rel.url}
					target="_blank"
					rel="noopener noreferrer"
					className="font-mono text-2xl font-bold text-(--text-primary) no-underline hover:text-(--accent)"
				>
					{rel.version}
				</a>
				<span
					className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${
						rel.latest
							? "bg-(--accent) text-(--on-accent)"
							: "border border-(--border-strong) bg-(--surface-raised) text-(--text-secondary)"
					}`}
				>
					{rel.channel}
				</span>
			</div>
			<time className="font-mono text-sm text-(--text-secondary)">{rel.date}</time>
		</div>
	);
}

/**
 * Renders a single release timeline entry with highlights and commit history.
 */
export function ShowReleaseTimelineItem({ rel }: ShowReleaseTimelineItemProps): ReactElement {
	return (
		<article className="rw-animate-in relative grid grid-cols-1 gap-6 border-b border-(--border) py-12 last:border-b-0 lg:grid-cols-[15rem_1fr] lg:gap-12">
			<RenderReleaseSidebarMeta rel={rel} />
			<div className="flex min-w-0 flex-col gap-6">
				<div className="flex flex-wrap items-baseline justify-between gap-4">
					<h2 className="m-0 text-2xl sm:text-3xl font-semibold tracking-tight text-(--text-primary)">
						{rel.name}
					</h2>
					<a
						href={rel.url}
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-sm text-(--accent) underline underline-offset-4 hover:text-(--accent-hover)"
					>
						View release tag
					</a>
				</div>
				<p className="m-0 text-lg leading-relaxed text-(--text-secondary)">{rel.summary}</p>
				<RenderReleaseHighlightList items={rel.highlights} />
				<ShowReleaseCommits
					version={rel.version}
					commitsUrl={rel.commitsUrl}
					commits={rel.commits}
				/>
			</div>
		</article>
	);
}
