// src/lib/playground/cvss-calculator.ts

const AV_WEIGHTS: Readonly<Record<string, number>> = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
const AC_WEIGHTS: Readonly<Record<string, number>> = { L: 0.77, H: 0.44 };
const UI_WEIGHTS: Readonly<Record<string, number>> = { N: 0.85, R: 0.62 };
const CIA_WEIGHTS: Readonly<Record<string, number>> = { H: 0.56, L: 0.22, N: 0 };

/**
 * Rounds up a float to 1 decimal place per the official FIRST.org CVSS v3 specification.
 */
function roundUp1(val: number): number {
	const intInput = Math.round(val * 100000);
	if (intInput % 10000 === 0) return intInput / 100000;
	return (Math.floor(intInput / 10000) + 1) / 10;
}

/**
 * Computes the CVSS v3.0/v3.1 Base Score (0.0 - 10.0) from a vector string.
 */
export function computeCvssV3Score(vector: string): number | null {
	if (!vector.startsWith("CVSS:3")) return null;
	const metrics: Record<string, string> = {};
	for (const part of vector.split("/").slice(1)) {
		const [k, v] = part.split(":");
		if (k && v) metrics[k] = v;
	}

	const scopeChanged = metrics.S === "C";
	const av = AV_WEIGHTS[metrics.AV ?? ""] ?? 0.85;
	const ac = AC_WEIGHTS[metrics.AC ?? ""] ?? 0.77;
	const ui = UI_WEIGHTS[metrics.UI ?? ""] ?? 0.85;
	const prMap = scopeChanged ? { N: 0.85, L: 0.68, H: 0.5 } : { N: 0.85, L: 0.62, H: 0.27 };
	const pr = prMap[(metrics.PR ?? "N") as "N" | "L" | "H"] ?? 0.85;

	const c = CIA_WEIGHTS[metrics.C ?? ""] ?? 0;
	const i = CIA_WEIGHTS[metrics.I ?? ""] ?? 0;
	const a = CIA_WEIGHTS[metrics.A ?? ""] ?? 0;

	const iscBase = 1 - (1 - c) * (1 - i) * (1 - a);
	if (iscBase <= 0) return 0;

	const impact = scopeChanged
		? 7.52 * (iscBase - 0.029) - 3.25 * (iscBase - 0.02) ** 15
		: 6.42 * iscBase;
	if (impact <= 0) return 0;

	const exploitability = 8.22 * av * ac * pr * ui;
	const raw = scopeChanged
		? Math.min(1.08 * (impact + exploitability), 10)
		: Math.min(impact + exploitability, 10);

	return roundUp1(raw);
}
