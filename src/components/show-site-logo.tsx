// src/components/show-site-logo.tsx
import Image from "next/image";
import type { ReactElement } from "react";

/**
 * Renders the brand mark and wordmark at a nav-appropriate size.
 */
export function ShowSiteLogo(): ReactElement {
	return (
		<span className="flex items-center gap-2.5">
			<Image
				src="/icon.png"
				alt="Rustywoof logo"
				width={44}
				height={44}
				className="size-10 sm:size-11 object-contain"
				priority
			/>
			<strong className="text-base sm:text-lg font-semibold tracking-tight text-(--text-primary)">
				Rustywoof
			</strong>
		</span>
	);
}
