// src/components/ui/show-cli-tab-bar.tsx
"use client";

import type { ReactElement, ReactNode } from "react";
import { ShowActionButton } from "./show-action-button";
import { ShowEcosystemIcon } from "./show-ecosystem-icon";

interface CliTabHeaderItem {
	readonly id: string;
	readonly label: string;
	readonly icon?: string | undefined;
}

interface CliTabItem extends CliTabHeaderItem {
	readonly command: string;
	readonly caption?: string | undefined;
}

export interface CliTabGroup extends CliTabHeaderItem {
	readonly items: readonly CliTabItem[];
}

interface ShowCliTabBarProps {
	readonly items: readonly CliTabHeaderItem[];
	readonly activeId: string;
	readonly onSelect: (id: string) => void;
	readonly sub?: boolean | undefined;
	readonly rightAction?: ReactNode | undefined;
}

/**
 * Renders an architectural non-pill tab bar with official brand icons.
 */
export function ShowCliTabBar({
	items,
	activeId,
	onSelect,
	sub = false,
	rightAction,
}: ShowCliTabBarProps): ReactElement {
	const renderedTabs = items.map((item) => (
		<ShowActionButton
			key={item.id}
			id={`tab:${item.id}`}
			role="tab"
			ariaSelected={item.id === activeId}
			active={item.id === activeId}
			onClick={() => onSelect(item.id)}
			className={sub ? "rw-tab-sub" : undefined}
		>
			<ShowEcosystemIcon kind={item.icon} />
			<span>{item.label}</span>
		</ShowActionButton>
	));

	if (!rightAction) {
		return (
			<div className="flex flex-wrap items-center p-4 px-3" role="tablist">
				{renderedTabs}
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center justify-between px-3" role="tablist">
			<div className="flex flex-wrap items-center gap-1">{renderedTabs}</div>
			<div className="py-1.5">{rightAction}</div>
		</div>
	);
}
