// scripts/ensure-wasm.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Checks for the compiled WASM binary and triggers compilation if missing.
 */
function ensureWasmBinary() {
	const wasmPath = path.join(process.cwd(), "public", "wasm", "rustywoof_bg.wasm");
	if (fs.existsSync(wasmPath)) {
		return;
	}

	console.log("WASM binary not found. Compiling wasm-core via wasm-pack...");
	try {
		execSync("wasm-pack --version", { stdio: "ignore" });
	} catch {
		console.error("Missing dependency: wasm-pack is not installed or not in PATH.");
		console.error("Install it with: cargo install wasm-pack");
		process.exit(1);
	}

	try {
		execSync("wasm-pack build --target web wasm-core --out-dir ../public/wasm", {
			stdio: "inherit",
		});
		console.log("WASM core built successfully.");
	} catch (error) {
		console.error("Failed to build wasm-core:", error);
		process.exit(1);
	}
}

ensureWasmBinary();
