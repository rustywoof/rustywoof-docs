// src/lib/cli-reference.ts
import {
	type CommandDef,
	type ExampleDef,
	type FlagDef,
	REPO_COMMANDS,
	SCAN_COMMANDS,
	SUPPLY_COMMANDS,
	SYSTEM_COMMANDS,
} from "./cli-reference/index";

export type { CommandDef, ExampleDef, FlagDef };

export const CLI_REFERENCE: Record<string, CommandDef> = {
	...SUPPLY_COMMANDS,
	...SCAN_COMMANDS,
	...REPO_COMMANDS,
	...SYSTEM_COMMANDS,
};
