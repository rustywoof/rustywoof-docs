// src/components/render-bullet-list.tsx
import type { ReactElement } from "react";

interface RenderBulletListProps {
	readonly items: readonly string[];
}

/**
 * Renders an unordered list of CLI edge cases or common mistakes.
 */
export function RenderBulletList({ items }: RenderBulletListProps): ReactElement {
	return (
		<ul className="ml-6 list-disc text-base text-(--text-secondary)">
			{items.map((item) => (
				<li key={item} className="mb-2">
					{item}
				</li>
			))}
		</ul>
	);
}
