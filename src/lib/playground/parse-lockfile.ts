// src/lib/playground/parse-lockfile.ts
export interface ParsedPackage {
	readonly name: string;
	readonly version: string;
	readonly ecosystem: "crates.io" | "npm" | "PyPI";
}

/**
 * Extracts resolved npm packages from a parsed package.json or package-lock.json object.
 */
function parseJsonDependencies(parsed: Record<string, unknown>, packages: ParsedPackage[]): void {
	const seen = new Set<string>();
	const addPkg = (name: string, rawVer: unknown): void => {
		if (typeof rawVer !== "string") return;
		const version = rawVer.replace(/^[\^~>=<v\s]+/, "").trim();
		if (!name || !version || !/^\d/.test(version)) return;
		const key = `${name}@${version}`;
		if (seen.has(key)) return;
		seen.add(key);
		packages.push({ name, version, ecosystem: "npm" });
	};

	if (parsed.packages && typeof parsed.packages === "object") {
		for (const [pkgPath, meta] of Object.entries(parsed.packages as Record<string, unknown>)) {
			if (!pkgPath || !meta || typeof meta !== "object") continue;
			const name = pkgPath.split("node_modules/").pop() ?? "";
			addPkg(name, (meta as { version?: unknown }).version);
		}
	}

	for (const section of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
		"optionalDependencies",
	]) {
		const deps = parsed[section];
		if (!deps || typeof deps !== "object") continue;
		for (const [name, entry] of Object.entries(deps as Record<string, unknown>)) {
			if (typeof entry === "string") addPkg(name, entry);
			else if (entry && typeof entry === "object") {
				addPkg(name, (entry as { version?: unknown }).version);
			}
		}
	}
}

/**
 * Extracts Cargo.lock, uv.lock, or poetry.lock package blocks from TOML text.
 */
function parseTomlLockBlocks(
	input: string,
	header: "[[package]]" | "[[distribution]]",
	defaultEcosystem: "crates.io" | "PyPI",
	packages: ParsedPackage[],
): void {
	const blocks = input.split(header).slice(1);
	for (const block of blocks) {
		const nameMatch = /name\s*=\s*"([^"]+)"/.exec(block);
		const verMatch = /version\s*=\s*"([^"]+)"/.exec(block);
		if (nameMatch?.[1] && verMatch?.[1]) {
			const isPyPi =
				defaultEcosystem === "PyPI" ||
				block.includes("pypi.org") ||
				block.includes("files.pythonhosted.org") ||
				block.includes("sdist") ||
				block.includes("wheels");
			packages.push({
				name: nameMatch[1],
				version: verMatch[1],
				ecosystem: isPyPi ? "PyPI" : "crates.io",
			});
		}
	}
}

/**
 * Extracts pinned npm packages from a pnpm-lock.yaml buffer.
 */
function parsePnpmLock(input: string, packages: ParsedPackage[]): void {
	const seen = new Set<string>();
	const regex = /^\s{2,4}'?\/?(@?[^@':\s]+(?:\s*\/[^@':\s]+)?)@(\d[^(':_\s]*)/gm;
	for (const match of input.matchAll(regex)) {
		const name = match[1]?.trim();
		const version = match[2]?.trim();
		if (name && version) {
			const key = `${name}@${version}`;
			if (!seen.has(key)) {
				seen.add(key);
				packages.push({ name, version, ecosystem: "npm" });
			}
		}
	}
}

/**
 * Extracts pinned Python dependencies from a requirements.txt buffer.
 */
function parseRequirementsTxt(input: string, packages: ParsedPackage[]): void {
	const lines = input.split(/\r?\n/);
	for (const rawLine of lines) {
		const line = rawLine.split("#")[0]?.trim() ?? "";
		if (!line || line.startsWith("-")) continue;
		const match = /^([A-Za-z0-9_.-]+)(?:\[[^\]]+\])?\s*(?:==|>=|~=)\s*([A-Za-z0-9_.+-]+)/.exec(
			line,
		);
		if (match?.[1] && match?.[2]) {
			packages.push({
				name: match[1].toLowerCase(),
				version: match[2],
				ecosystem: "PyPI",
			});
		}
	}
}

/**
 * Parses package.json, package-lock.json, pnpm-lock.yaml, Cargo.lock, uv.lock, or requirements.txt.
 */
export function parseLockfileSnippet(input: string, filename?: string): ParsedPackage[] {
	const trimmed = input.trim();
	if (!trimmed) return [];
	const packages: ParsedPackage[] = [];
	const lowerFile = filename?.toLowerCase() ?? "";

	if (trimmed.startsWith("{")) {
		try {
			parseJsonDependencies(JSON.parse(trimmed) as Record<string, unknown>, packages);
			return packages;
		} catch {
			return [];
		}
	}

	if (
		lowerFile.endsWith(".yaml") ||
		lowerFile.endsWith(".yml") ||
		trimmed.startsWith("lockfileVersion:")
	) {
		parsePnpmLock(trimmed, packages);
		return packages;
	}

	if (trimmed.includes("[[package]]")) {
		const isPythonLock =
			lowerFile.endsWith("uv.lock") ||
			lowerFile.endsWith("poetry.lock") ||
			trimmed.includes("pypi.org") ||
			trimmed.includes("[package.metadata]");
		parseTomlLockBlocks(trimmed, "[[package]]", isPythonLock ? "PyPI" : "crates.io", packages);
		return packages;
	}

	if (trimmed.includes("[[distribution]]")) {
		parseTomlLockBlocks(trimmed, "[[distribution]]", "PyPI", packages);
		return packages;
	}

	parseRequirementsTxt(trimmed, packages);
	return packages;
}
