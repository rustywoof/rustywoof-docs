// src/lib/scan-secrets/execute-scan.ts

import init, { executeScanWasm } from "../../../public/wasm/rustywoof.js";

export interface ScanResult {
	ruleName: string;
	isEntropyValid: boolean;
}

export interface ScanConfig {
	customRules?: { name: string; pattern: string }[];
}

const isTestEnv =
	typeof process !== "undefined" &&
	(process.env as unknown as { NODE_ENV: string }).NODE_ENV === "test";
let wasmInitialized = false;

/**
 * Calculates mock Shannon entropy for test environments where WASM is unavailable.
 */
function calculateEntropyMock(str: string): number {
	const len = str.length;
	if (len === 0) return 0;
	const frequencies: Record<string, number> = {};
	for (let i = 0; i < len; i++) {
		const char = str.charAt(i);
		frequencies[char] = (frequencies[char] || 0) + 1;
	}
	let entropy = 0;
	for (const char in frequencies) {
		const count = frequencies[char];
		if (count !== undefined) {
			const p = count / len;
			entropy -= p * Math.log2(p);
		}
	}
	return entropy;
}

/**
 * Scans the provided text for leaked credentials using WebAssembly or test mock fallback.
 */
export async function executeScan(text: string, config: ScanConfig = {}): Promise<ScanResult[]> {
	if (isTestEnv) {
		const results: ScanResult[] = [];
		if (!config.customRules) return results;
		for (const rule of config.customRules) {
			const regex = new RegExp(rule.pattern, "g");
			const matches = text.match(regex);
			if (matches) {
				for (const matchStr of matches) {
					const entropy = calculateEntropyMock(matchStr);
					results.push({ ruleName: rule.name, isEntropyValid: entropy > 3.0 });
				}
			}
		}
		return results;
	}

	if (!wasmInitialized) {
		await init("/wasm/rustywoof_bg.wasm");
		wasmInitialized = true;
	}
	return executeScanWasm(text, config);
}
