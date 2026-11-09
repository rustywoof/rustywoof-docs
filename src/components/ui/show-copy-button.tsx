// src/components/ui/show-copy-button.tsx
"use client";

import { type ReactElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib";
import { copyText } from "./copy-text";
import { ShowCheckIcon } from "./show-check-icon";
import { ShowCopyIcon } from "./show-copy-icon";

interface ShowCopyButtonProps {
	readonly text: string;
	readonly className?: string | undefined;
	readonly label?: string | undefined;
}

/**
 * Renders an architectural copy button with tactile visual feedback and fallback support.
 */
export function ShowCopyButton({
	text,
	className,
	label = "Copy to clipboard",
}: ShowCopyButtonProps): ReactElement {
	const [copied, setCopied] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const handleCopy = async (): Promise<void> => {
		const ok = await copyText(text);
		if (!ok) return;
		setCopied(true);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			aria-label={label}
			title={label}
			className={cn("rw-copy-btn", className)}
		>
			{copied ? <ShowCheckIcon className="text-(--rw-accent)" /> : <ShowCopyIcon />}
		</button>
	);
}
