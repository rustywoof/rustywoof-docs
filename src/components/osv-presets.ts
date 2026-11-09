// src/components/osv-presets.ts
export interface EcosystemPreset {
	readonly id: string;
	readonly ecosystem: string;
	readonly icon: string;
	readonly lockfile: string;
	readonly defaultPkg: string;
	readonly defaultVersion: string;
}

export const OSV_PRESETS: readonly EcosystemPreset[] = [
	{
		id: "cargo",
		ecosystem: "crates.io",
		icon: "rust",
		lockfile: "Cargo.lock",
		defaultPkg: "hyper",
		defaultVersion: "1.4.1",
	},
	{
		id: "pnpm",
		ecosystem: "pnpm",
		icon: "pnpm",
		lockfile: "pnpm-lock.yaml",
		defaultPkg: "axios",
		defaultVersion: "1.7.9",
	},
	{
		id: "pypi",
		ecosystem: "PyPI",
		icon: "uv",
		lockfile: "uv.lock",
		defaultPkg: "django",
		defaultVersion: "6.1.1",
	},
];
