// src/components/playground/use-playground-file-state.ts
"use client";

import { type DragEvent, useState } from "react";
import type { PlaygroundMode } from "@/lib";
import { type AuditPreset, SAMPLES } from "./playground-data";

export interface PlaygroundFileState {
	readonly mode: PlaygroundMode;
	readonly filename: string;
	readonly inputText: string;
	readonly setInputText: (v: string) => void;
	readonly isDragging: boolean;
	readonly setIsDragging: (v: boolean) => void;
	readonly switchMode: (next: PlaygroundMode) => void;
	readonly selectPreset: (preset: AuditPreset) => void;
	readonly loadUploadedFile: (file: File) => Promise<void>;
	readonly onDrop: (e: DragEvent<HTMLElement>) => void;
	readonly loadSample: () => void;
	readonly clearInput: () => void;
}

/**
 * Infers the appropriate playground mode when a user uploads a lockfile or manifest.
 */
function inferNextMode(currentMode: PlaygroundMode, filename: string): PlaygroundMode {
	const lower = filename.toLowerCase();
	if (
		currentMode === "scan" &&
		(lower === "package.json" || lower.endsWith(".lock") || lower.includes("requirements"))
	) {
		return "audit";
	}
	return currentMode;
}

/**
 * Manages active playground mode, file buffer content, and drag-and-drop state.
 */
export function usePlaygroundFileState(): PlaygroundFileState {
	const [mode, setMode] = useState<PlaygroundMode>("scan");
	const [filename, setFilename] = useState<string>(SAMPLES.scan.label);
	const [inputText, setInputText] = useState<string>("");
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const switchMode = (next: PlaygroundMode): void => {
		setMode(next);
		setFilename(SAMPLES[next].label);
		setInputText("");
	};
	const selectPreset = (preset: AuditPreset): void => {
		setFilename(preset.label);
		setInputText(preset.text);
	};
	const loadSample = (): void => {
		setFilename(SAMPLES[mode].label);
		setInputText(SAMPLES[mode].text);
	};
	const clearInput = (): void => {
		setInputText("");
	};
	const loadUploadedFile = async (file: File): Promise<void> => {
		const content = await file.text();
		setFilename(file.name);
		setInputText(content);
		setMode(inferNextMode(mode, file.name));
	};
	const onDrop = (e: DragEvent<HTMLElement>): void => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) loadUploadedFile(file).catch(() => {});
	};

	return {
		mode,
		filename,
		inputText,
		setInputText,
		isDragging,
		setIsDragging,
		switchMode,
		selectPreset,
		loadUploadedFile,
		onDrop,
		loadSample,
		clearInput,
	};
}
