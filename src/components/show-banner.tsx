// src/components/show-banner.tsx
"use client";

import { X } from "lucide-react";
import { type HTMLAttributes, type ReactElement, useEffect, useState } from "react";
import { cn } from "@/lib";

/**
 * Encodes a banner identifier into a lowercase Base32 key for CSS and storage use.
 */
function encodeBase32(str: string): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
	let encoded = "";
	let buffer = 0;
	let bitsLeft = 0;
	for (let i = 0; i < str.length; i++) {
		buffer = (buffer << 8) | str.charCodeAt(i);
		bitsLeft += 8;
		while (bitsLeft >= 5) {
			bitsLeft -= 5;
			encoded += alphabet[(buffer >> bitsLeft) & 31];
		}
	}
	if (bitsLeft > 0) encoded += alphabet[(buffer << (5 - bitsLeft)) & 31];
	return encoded;
}

/**
 * Manages the dismissed state of an announcement banner in localStorage.
 */
function useBannerState(id?: string) {
	const [isOpen, setIsOpen] = useState(true);
	const globalKey = id ? `nd-banner-${encodeBase32(id)}` : null;

	useEffect(() => {
		try {
			if (globalKey && localStorage.getItem(globalKey) === "true") setIsOpen(false);
		} catch {
			// Why: Private browsing or restricted storage permissions may throw when reading localStorage.
		}
	}, [globalKey]);

	const onClose = (): void => {
		setIsOpen(false);
		try {
			if (globalKey) localStorage.setItem(globalKey, "true");
		} catch {
			// Why: Private browsing mode disables localStorage writes without breaking in-memory dismissal.
		}
	};

	return { isOpen, globalKey, onClose };
}

type ShowBannerProps = HTMLAttributes<HTMLDivElement> & {
	height?: string | undefined;
	changeLayout?: boolean | undefined;
};

/**
 * Renders a dismissible top announcement bar.
 */
export function ShowBanner({
	id,
	changeLayout = true,
	height = "3rem",
	...props
}: ShowBannerProps): ReactElement | null {
	const { isOpen, globalKey, onClose } = useBannerState(id);
	if (!isOpen) return null;

	return (
		<div
			id={id}
			{...props}
			className={cn(
				"relative z-40 flex min-h-12 flex-row items-center justify-center border-b border-(--border) bg-(--surface-raised) py-2 pr-11 pl-4 sm:px-10 text-center text-xs sm:text-sm md:text-base font-medium text-(--text-primary)",
				props.className,
			)}
		>
			{changeLayout ? <style>{`:root { --fd-banner-height: ${height}; }`}</style> : null}
			{globalKey ? <style>{`.${globalKey} #${id} { display: none; }`}</style> : null}
			<div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
				{props.children}
			</div>
			{id ? (
				<button
					type="button"
					aria-label="Close Banner"
					onClick={onClose}
					className="absolute inset-e-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
				>
					<X className="size-4" />
				</button>
			) : null}
		</div>
	);
}
