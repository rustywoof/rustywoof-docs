// src/components/ui/detect-lang-from-filename.ts
import type { Lang } from "./highlight-rules";

/**
 * Infers the syntax highlighting language from a filename extension.
 */
export function detectLangFromFilename(filename: string): Lang {
	const ext = filename.split(".").pop()?.toLowerCase() ?? "";
	if (["ts", "tsx", "js", "jsx", "mjs", "cjs"].includes(ext)) return "ts";
	if (ext === "rs") return "rust";
	if (ext === "py") return "python";
	if (ext === "toml" || ext === "lock") return "toml";
	if (ext === "json") return "json";
	return "text";
}
