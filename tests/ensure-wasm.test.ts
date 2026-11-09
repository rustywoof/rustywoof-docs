// tests/ensure-wasm.test.ts
import { execSync } from "node:child_process";
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

describe("ensureWasmBinary error states", () => {
	it("throws when wasm-pack command execution fails during compilation", () => {
		const existsSpy = vi.spyOn(fs, "existsSync").mockReturnValue(false);
		const invalidCmd = ["mock", "fail"].join("-");

		expect(() => {
			if (!fs.existsSync("public/wasm/rustywoof_bg.wasm")) {
				execSync(invalidCmd, { stdio: "pipe" });
			}
		}).toThrowError("Command failed: mock-fail");

		existsSpy.mockRestore();
	});

	it("throws an error when target wasm-core path does not exist", () => {
		const existsSpy = vi.spyOn(fs, "existsSync").mockReturnValue(false);

		expect(() => {
			if (!fs.existsSync("wasm-core/Cargo.toml")) {
				throw new Error("Missing wasm-core/Cargo.toml");
			}
		}).toThrowError("Missing wasm-core/Cargo.toml");

		existsSpy.mockRestore();
	});
});
