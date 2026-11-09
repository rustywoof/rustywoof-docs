// src/components/blog/show-author-avatar.tsx
"use client";

import { type ReactElement, useState } from "react";

interface ShowAuthorAvatarProps {
	readonly src: string;
	readonly name: string;
}

/**
 * Renders an avatar with an initials fallback so a failed image never shows a broken icon.
 */
export function ShowAuthorAvatar({ src, name }: ShowAuthorAvatarProps): ReactElement {
	const [hasFailed, setHasFailed] = useState(false);
	const initials = name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	if (hasFailed) {
		return (
			<span
				aria-hidden="true"
				className="flex size-10 items-center justify-center rounded-full bg-(--surface-selected) text-xs font-semibold text-(--text-primary)"
			>
				{initials}
			</span>
		);
	}
	return (
		/* biome-ignore lint/performance/noImgElement: remote avatar with onError fallback */
		<img
			src={src}
			alt={`${name} avatar`}
			width={40}
			height={40}
			loading="lazy"
			onError={() => setHasFailed(true)}
			className="size-10 rounded-full border border-(--border) object-cover"
		/>
	);
}
