// src/lib/scan-secrets/worker.ts
import { executeScan, type ScanResult } from "./execute-scan";

self.addEventListener("message", (e: MessageEvent) => {
	const { text, config } = e.data;

	executeScan(text, config)
		.then((results: ScanResult[]) => {
			self.postMessage({ type: "SUCCESS", payload: results });
		})
		.catch((error: unknown) => {
			self.postMessage({ type: "ERROR", payload: String(error) });
		});
});
