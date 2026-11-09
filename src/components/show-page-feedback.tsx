// src/components/show-page-feedback.tsx
"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { type ReactElement, useEffect, useState } from "react";
import { cn } from "@/lib";

type Vote = "good" | "bad";

interface ShowPageFeedbackProps {
	readonly path: string;
}

/**
 * Persists a page feedback vote to localStorage and the feedback endpoint.
 */
async function recordFeedbackVote(key: string, path: string, next: Vote): Promise<void> {
	try {
		localStorage.setItem(key, next);
	} catch {
		// Why: Private browsing or restricted storage quota disables localStorage writes without breaking session state.
	}
	try {
		await fetch("/api/feedback", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ path, vote: next }),
		});
	} catch {
		// Why: Offline clients still retain their in-memory and localStorage feedback vote.
	}
}

/**
 * Loads a previously saved feedback vote from localStorage if available.
 */
function readSavedVote(key: string): Vote | null {
	try {
		const saved = localStorage.getItem(key);
		if (saved === "good" || saved === "bad") return saved;
	} catch {
		// Why: Private browsing mode may throw when reading localStorage.
	}
	return null;
}

/**
 * Renders a single thumbs-up or thumbs-down feedback button.
 */
function RenderFeedbackVoteButton({
	value,
	activeVote,
	label,
	Icon,
	onVote,
}: {
	readonly value: Vote;
	readonly activeVote: Vote | null;
	readonly label: string;
	readonly Icon: typeof ThumbsUp;
	readonly onVote: (v: Vote) => void;
}): ReactElement {
	const isSelected = activeVote === value;
	return (
		<button
			type="button"
			onClick={() => onVote(value)}
			aria-pressed={isSelected}
			className={cn(
				"rw-pill rw-pill-soft rw-pill-sm",
				isSelected && "!bg-(--accent)! !text-(--on-accent)!",
			)}
		>
			<Icon className="size-4" aria-hidden="true" />
			{label}
		</button>
	);
}

/**
 * Renders the "How is this guide?" thumbs up/down feedback widget with remembered vote.
 */
export function ShowPageFeedback({ path }: ShowPageFeedbackProps): ReactElement {
	const key = `rw-feedback:${path}`;
	const [vote, setVote] = useState<Vote | null>(null);
	useEffect(() => setVote(readSavedVote(key)), [key]);
	const handleVote = (next: Vote): void => {
		setVote(next);
		recordFeedbackVote(key, path, next).catch(() => {});
	};
	return (
		<div className="flex flex-wrap items-center gap-3">
			<span className="text-sm font-medium text-(--text-primary)">How is this guide?</span>
			<RenderFeedbackVoteButton
				value="good"
				activeVote={vote}
				label="Good"
				Icon={ThumbsUp}
				onVote={handleVote}
			/>
			<RenderFeedbackVoteButton
				value="bad"
				activeVote={vote}
				label="Bad"
				Icon={ThumbsDown}
				onVote={handleVote}
			/>
			{vote ? (
				<span className="text-sm text-(--text-secondary)">Thanks for the feedback.</span>
			) : null}
		</div>
	);
}
