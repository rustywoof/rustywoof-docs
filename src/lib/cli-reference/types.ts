// src/lib/cli-reference/types.ts
export interface FlagDef {
	readonly name: string;
	readonly type: string;
	readonly description: string;
	readonly defaultValue?: string;
	readonly added?: string | undefined;
	readonly deprecated?: string | undefined;
}

export interface ExampleDef {
	readonly command: string;
	readonly output: string;
	readonly explanation: string;
}

export interface CommandDef {
	readonly purpose: string;
	readonly synopsis: string;
	readonly flags: readonly FlagDef[];
	readonly exitCodes: Readonly<Record<number, string>>;
	readonly examples: readonly ExampleDef[];
	readonly edgeCases?: readonly string[];
	readonly commonMistakes?: readonly string[];
}

export const HELP_FLAG: FlagDef = {
	name: "-h, --help",
	type: "boolean",
	description: "Print help",
};
