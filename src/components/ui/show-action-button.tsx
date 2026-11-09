// src/components/ui/show-action-button.tsx
"use client";

import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib";

interface ShowActionButtonProps {
	readonly id?: string | undefined;
	readonly onClick: () => void;
	readonly children: ReactNode;
	readonly active?: boolean | undefined;
	readonly role?: "tab" | "button" | undefined;
	readonly ariaSelected?: boolean | undefined;
	readonly className?: string | undefined;
}

/**
 * Renders an interactive button or architectural non-pill tab trigger.
 */
export function ShowActionButton({
	id,
	onClick,
	children,
	active,
	role,
	ariaSelected,
	className,
}: ShowActionButtonProps): ReactElement {
	if (role === "tab") {
		return (
			<button
				type="button"
				role="tab"
				id={id}
				aria-selected={ariaSelected ?? Boolean(active)}
				data-active={Boolean(active)}
				onClick={onClick}
				className={cn("rw-tab", className)}
			>
				{children}
			</button>
		);
	}
	return (
		<button
			type="button"
			id={id}
			data-active={Boolean(active)}
			onClick={onClick}
			className={cn("rw-pill rw-pill-muted", className)}
		>
			{children}
		</button>
	);
}
