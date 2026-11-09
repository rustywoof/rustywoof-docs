// src/components/show-terminal-replay.tsx
"use client";

import { type ReactElement, useState } from "react";
import { RenderTerminalLines } from "./render-terminal-lines";
import { SCENARIOS, type TerminalFrame } from "./terminal-scenarios";
import { ShowCliTabBar, ShowCopyButton, ShowEcosystemIcon } from "./ui";

interface ShowTerminalReplayProps {
	readonly frames?: readonly TerminalFrame[] | undefined;
}

/**
 * Renders a static frame sequence inside a uniform terminal window.
 */
function RenderFrameReplayWindow({
	frames,
}: {
	readonly frames: readonly TerminalFrame[];
}): ReactElement {
	const rawFrames = frames.map((f) => f.text).join("\n");
	return (
		<div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) shadow-(--rw-window-shadow)">
			<div className="flex items-center justify-between gap-3 border-b border-(--rw-code-border) bg-(--rw-code-head) px-4 py-2.5">
				<span className="flex items-center gap-2.5 font-mono text-sm text-(--text-primary)">
					<ShowEcosystemIcon kind="bash" />
					<span>woof session</span>
				</span>
				<ShowCopyButton text={rawFrames} />
			</div>
			<RenderTerminalLines
				lines={frames.map((frame, i) => ({ id: frame.id ?? `f-${i}`, text: frame.text }))}
			/>
		</div>
	);
}

/**
 * Renders an interactive CLI scenario replay window with uniform terminal chrome.
 */
export function ShowTerminalReplay({ frames }: ShowTerminalReplayProps): ReactElement | null {
	const [activeId, setActiveId] = useState<string>("patrol");
	if (frames && frames.length > 0) return <RenderFrameReplayWindow frames={frames} />;
	const scenario = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];
	if (!scenario) return null;
	const rawScenario = [`$ ${scenario.command}`, ...scenario.lines.map((l) => l.text)].join("\n");

	return (
		<div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-(--rw-code-border) bg-(--rw-code-bg) shadow-(--rw-window-shadow)">
			<ShowCliTabBar
				items={SCENARIOS}
				activeId={scenario.id}
				onSelect={setActiveId}
				rightAction={<ShowCopyButton text={rawScenario} />}
			/>
			<div key={scenario.id} className="rw-animate-in relative flex w-full flex-col">
				<RenderTerminalLines
					lines={[{ id: "cmd", text: `$ ${scenario.command}`, tone: "accent" }, ...scenario.lines]}
				/>
			</div>
		</div>
	);
}
