// src/components/playground/use-playground-runner.ts
"use client";

import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import type { TerminalLine } from "@/components";
import {
	buildSniffGraphLines,
	executeOsvAudit,
	type PlaygroundMode,
	parseLockfileSnippet,
} from "@/lib";
import { buildAuditOutput } from "./build-audit-output";
import { buildScanOutput } from "./build-scan-output";
import { CORE_RULES } from "./playground-data";

const SPINNER_FRAMES = ["◡", "◝", "◠", "◞", "◜"];

/**
 * Dispatches a secret scan to the worker and formats the diagnostic frame.
 */
function dispatchWorkerScan(
	workerRef: MutableRefObject<Worker | null>,
	inputText: string,
	filename: string,
	setLines: (lines: readonly TerminalLine[]) => void,
	setIsBusy: (busy: boolean) => void,
): void {
	if (!workerRef.current) return;
	setIsBusy(true);
	workerRef.current.onmessage = (e: MessageEvent) => {
		setLines(buildScanOutput(e.data.payload || [], false, filename, inputText));
		setIsBusy(false);
	};
	workerRef.current.postMessage({ text: inputText, config: { customRules: CORE_RULES } });
}

/**
 * Executes a supply chain OSV audit with a live spinning progress animation.
 */
async function dispatchOsvAudit(
	inputText: string,
	filename: string,
	setLines: (lines: readonly TerminalLine[]) => void,
	setIsBusy: (busy: boolean) => void,
): Promise<void> {
	setIsBusy(true);
	const pkgs = parseLockfileSnippet(inputText, filename);
	let tick = 0;
	const renderProgress = (t: number): void => {
		const frame = SPINNER_FRAMES[t % SPINNER_FRAMES.length] ?? "◡";
		setLines([
			{ id: "au-cmd", text: " woof audit", tone: "accent" },
			{ id: "au-init", text: "[INFO] Initiating multi-ecosystem lockfile audit...", tone: "muted" },
			{
				id: "au-ext",
				text: `[INFO] Extracted ${pkgs.length} dependencies across 1 ecosystems.`,
				tone: "muted",
			},
			{
				id: "au-spin",
				text: `${frame} Cross-referencing CVEs: querying OSV for ${pkgs.length} packages`,
				tone: "accent",
			},
		]);
	};
	renderProgress(0);
	const interval = setInterval(() => {
		tick += 1;
		renderProgress(tick);
	}, 120);

	try {
		const findings = await executeOsvAudit(pkgs);
		clearInterval(interval);
		setLines(buildAuditOutput(pkgs, findings));
	} catch {
		clearInterval(interval);
		setLines(buildAuditOutput(pkgs, []));
	} finally {
		clearInterval(interval);
		setIsBusy(false);
	}
}

export interface PlaygroundRunnerState {
	readonly lines: readonly TerminalLine[];
	readonly isBusy: boolean;
	readonly runAudit: () => void;
}

/**
 * Coordinates secret scanning, dependency graph tracing, and explicit OSV lockfile auditing.
 */
export function usePlaygroundRunner(
	mode: PlaygroundMode,
	inputText: string,
	filename: string,
	sniffFilter: string,
): PlaygroundRunnerState {
	const [lines, setLines] = useState<readonly TerminalLine[]>([]);
	const [isBusy, setIsBusy] = useState<boolean>(false);
	const workerRef = useRef<Worker | null>(null);
	const prevAuditFileRef = useRef<string>("");

	useEffect(() => {
		workerRef.current = new Worker(new URL("@/lib/scan-secrets/worker.ts", import.meta.url));
		return () => workerRef.current?.terminate();
	}, []);

	const runAudit = useCallback(() => {
		if (inputText.trim()) {
			dispatchOsvAudit(inputText, filename, setLines, setIsBusy).catch(() => {});
		}
	}, [inputText, filename]);

	useEffect(() => {
		if (!inputText.trim()) {
			prevAuditFileRef.current = "";
			const cmd = mode === "scan" ? "woof scan" : mode === "audit" ? "woof audit" : "woof sniff";
			const target = mode === "scan" ? "source code" : "lockfile";
			setLines([
				{ id: "ready-cmd", text: `$ ${cmd}`, tone: "accent" },
				{
					id: "ready-info",
					text: `[INFO] Ready. Insert or paste ${target} on the left, or run samples.`,
					tone: "muted",
				},
			]);
			return;
		}
		if (mode === "audit") {
			if (prevAuditFileRef.current !== filename) {
				prevAuditFileRef.current = filename;
				runAudit();
			}
			return;
		}
		const timer = setTimeout(() => {
			if (mode === "scan") {
				dispatchWorkerScan(workerRef, inputText, filename, setLines, setIsBusy);
			} else if (mode === "sniff") {
				setLines(buildSniffGraphLines(inputText, sniffFilter));
			}
		}, 240);
		return () => clearTimeout(timer);
	}, [mode, inputText, filename, sniffFilter, runAudit]);

	return { lines, isBusy, runAudit };
}
