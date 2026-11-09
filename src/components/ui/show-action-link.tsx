// src/components/ui/show-action-link.tsx
"use client";

import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib";

interface ShowActionLinkProps {
	readonly href: string;
	readonly children: ReactNode;
	readonly external?: boolean | undefined;
	readonly variant?: "primary" | "soft" | undefined;
	readonly size?: "md" | "sm" | undefined;
	readonly className?: string | undefined;
}

/**
 * Renders a smooth pill link for primary and secondary navigation actions.
 */
export function ShowActionLink({
	href,
	children,
	external,
	variant = "soft",
	size = "md",
	className,
}: ShowActionLinkProps): ReactElement {
	const classes = cn(
		"rw-pill",
		variant === "primary" ? "rw-pill-primary" : "rw-pill-soft",
		size === "sm" && "rw-pill-sm",
		className,
	);

	if (external) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={classes}>
			{children}
		</Link>
	);
}
