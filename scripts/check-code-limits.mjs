// scripts/check-code-limits.mjs
import fs from "node:fs";
import path from "node:path";

const MAX_FILE_LINES = 450;
const MAX_FUNC_LINES = 60;

/**
 * Calculates the maximum function line length in a given source file string.
 */
function getMaxFunctionLines(content) {
	const lines = content.split("\n");
	let maxLen = 0;
	const funcRegex =
		/\b(function\b|\b(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_$][\w$]*)\s*=>)/;

	for (let i = 0; i < lines.length; i++) {
		if (!funcRegex.test(lines[i])) continue;
		let depth = 0;
		let started = false;
		for (let j = i; j < lines.length; j++) {
			for (const ch of lines[j]) {
				if (ch === "{") {
					depth++;
					started = true;
				} else if (ch === "}") {
					depth--;
				}
			}
			if (started && depth === 0) {
				maxLen = Math.max(maxLen, j - i + 1);
				break;
			}
		}
	}
	return maxLen;
}

/**
 * Recursively scans a directory for files exceeding the configured line limits.
 */
function scanDirectoryLimits(dir, onViolation) {
	for (const file of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, file);
		if (
			fullPath.includes("node_modules") ||
			fullPath.includes(".next") ||
			fullPath.includes(".git")
		)
			continue;
		if (fs.statSync(fullPath).isDirectory()) {
			scanDirectoryLimits(fullPath, onViolation);
		} else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
			const content = fs.readFileSync(fullPath, "utf8");
			const lines = content.split("\n").length;
			const maxFunc = getMaxFunctionLines(content);
			if (lines > MAX_FILE_LINES) {
				console.error(`${fullPath} exceeds file length limit (${lines}/${MAX_FILE_LINES})`);
				onViolation();
			}
			if (maxFunc > MAX_FUNC_LINES) {
				console.error(`${fullPath} exceeds function length limit (${maxFunc}/${MAX_FUNC_LINES})`);
				onViolation();
			}
		}
	}
}

/**
 * Executes the repository file and function line limit audit.
 */
function checkLimits() {
	let hasFailed = false;
	scanDirectoryLimits(process.cwd(), () => {
		hasFailed = true;
	});
	if (hasFailed) process.exit(1);
	process.stdout.write("Code limits check passed.\n");
}
checkLimits();
