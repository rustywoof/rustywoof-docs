// src/components/playground/build-scan-output.ts
import type { TerminalLine } from "@/components";
import type { ScanResult } from "@/lib";

/**
 * Formats a single secret exposure finding into an authentic box-drawing diagnostic frame.
 */
function buildExposureFrame(
	ruleName: string,
	file: string,
	line: number,
	col: number,
	code: string,
	idx: number,
): readonly TerminalLine[] {
	const markerPad = " ".repeat(Math.max(0, col - 1));
	return [
		{
			id: `exp-h-${idx}`,
			text: `× [CRITICAL] Compromised Asset Detected: ${ruleName}`,
			tone: "danger",
		},
		{ id: `exp-c-${idx}`, text: `╭─[./${file}:${line}:${col}]`, tone: "muted" },
		{ id: `exp-l-${idx}`, text: `${line} │ ${code}` },
		{ id: `exp-m1-${idx}`, text: `· ${markerPad}──────────┬─────────`, tone: "danger" },
		{
			id: `exp-m2-${idx}`,
			text: `· ${markerPad}          ╰── Exposure found here`,
			tone: "danger",
		},
		{ id: `exp-f-${idx}`, text: "╰────", tone: "muted" },
	];
}

/**
 * Locates line number, column, and masked preview text for a secret match in the raw buffer.
 */
function locateMatchContext(
	text: string,
	ruleName: string,
): { line: number; col: number; preview: string } {
	const lines = text.split("\n");
	const pattern = ruleName.includes("AWS") ? /AKIA[0-9A-Z]{16}/ : /gh[pusor]_[A-Za-z0-9_]{36}/;
	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i] ?? "";
		const m = pattern.exec(raw);
		if (m && m.index !== undefined) {
			const masked = `${raw.slice(0, m.index)}"${"*".repeat(m[0].length)}"${raw.slice(m.index + m[0].length + 1)}`;
			return { line: i + 1, col: m.index + 1, preview: masked.trimEnd() };
		}
	}
	return { line: 1, col: 1, preview: (lines[0] ?? "").slice(0, 80) };
}

/**
 * Formats secret scanner results into authentic Rustywoof terminal output lines.
 */
export function buildScanOutput(
	results: readonly ScanResult[],
	isCiStrict: boolean,
	filename = "src/auth.ts",
	inputText = "",
): readonly TerminalLine[] {
	const count = results.length;
	const out: TerminalLine[] = [
		{ id: "sc-cmd", text: isCiStrict ? "$ woof check ." : "$ woof scan", tone: "accent" },
		{ id: "sc-idx", text: "[INFO] Indexing perimeter...", tone: "muted" },
		{
			id: "sc-bar",
			text: "Scanning ├── [██████████████████████████████] 100% | 646.04 KiB / 646.04 KiB @ 134.03 MiB/s | 146/146 files           [INFO] Sweep complete. Analyzed 146 files in 4ms.",
			tone: "muted",
		},
	];

	if (count === 0) {
		out.push({
			id: "sc-ok",
			text: "[OK] Perimeter secure. Zero exposed assets detected.",
			tone: "success",
		});
		return out;
	}

	out.push({
		id: "sc-breach",
		text: `[CRITICAL] Perimeter breached! Found ${count} exposed asset${count === 1 ? "" : "s"}.`,
		tone: "danger",
	});

	results.forEach((r, idx) => {
		const loc = locateMatchContext(inputText, r.ruleName);
		out.push(...buildExposureFrame(r.ruleName, filename, loc.line, loc.col, loc.preview, idx));
	});

	return out;
}
