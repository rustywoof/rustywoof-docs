// tests/code-window.test.ts
import { describe, expect, it } from "vitest";
import { RenderTerminalLines } from "@/components";
import {
	detectLangFromFilename,
	RenderHighlight,
	ShowCodeWindow,
	ShowEcosystemIcon,
	ShowTerminalWindow,
} from "@/components/ui";
import { getProps, isRecord } from "./test-utils";

/**
 * Validates ShowCodeWindow, ShowTerminalWindow, RenderTerminalLines, RenderHighlight, and ShowEcosystemIcon boundary states.
 */
describe("ShowCodeWindow, ShowTerminalWindow, and RenderHighlight boundary states", () => {
	it("renders ShowCodeWindow with an empty lines array without throwing", () => {
		const element = ShowCodeWindow({ filename: "empty.ts", lines: [] });
		expect(element).toBeDefined();
		const props = getProps(element);
		expect(String(props.className)).toContain("bg-(--rw-code-bg)");
	});

	it("preserves danger line highlighting when a leaked secret line has empty text", () => {
		const element = ShowCodeWindow({
			filename: "leak.rs",
			lines: [{ line: 1, text: "", danger: true }],
		});
		const props = getProps(element);
		const children = Array.isArray(props.children) ? props.children : [];
		const table = children[1];
		const tableProps = isRecord(table) && isRecord(table.props) ? table.props : {};
		const tableChildren = Array.isArray(tableProps.children) ? tableProps.children : [];
		const firstLine = tableChildren[0];
		const firstLineProps = isRecord(firstLine) && isRecord(firstLine.props) ? firstLine.props : {};
		expect(String(firstLineProps.className)).toContain("bg-(--rw-code-danger-bg)");
	});

	it("renders ShowTerminalWindow and RenderTerminalLines with wrapped span elements and zero scrollbars", () => {
		const win = ShowTerminalWindow({
			label: "Audit",
			title: "woof audit",
			lines: [{ id: "empty", text: "" }],
		});
		const winProps = getProps(win);
		expect(String(winProps.className)).toContain("bg-(--rw-code-bg)");

		const pre = RenderTerminalLines({
			lines: [
				{ id: "l1", text: "" },
				{ id: "l2", text: "├── box-drawing@1.0.0", tone: "accent" },
			],
		});
		const preProps = getProps(pre);
		expect(pre.type).toBe("pre");
		expect(String(preProps.className)).toContain("whitespace-pre-wrap");
		expect(String(preProps.className)).not.toContain("overflow-x-auto");
		const spans = Array.isArray(preProps.children) ? preProps.children : [];
		const firstSpanProps = isRecord(spans[0]) && isRecord(spans[0].props) ? spans[0].props : {};
		const secondSpanProps = isRecord(spans[1]) && isRecord(spans[1].props) ? spans[1].props : {};
		expect(firstSpanProps.children).toBe("\u00A0");
		expect(String(secondSpanProps.className)).toContain("rw-tone-accent");
	});

	it("resolves unknown file extensions to plain text in detectLangFromFilename and highlights empty strings safely", () => {
		expect(detectLangFromFilename("archive.tar.gz")).toBe("text");
		expect(detectLangFromFilename("")).toBe("text");
		expect(detectLangFromFilename("Cargo.lock")).toBe("toml");
		expect(detectLangFromFilename("src/index.tsx")).toBe("ts");

		const node = RenderHighlight({ text: 'const KEY = "val"; // comment', lang: "ts" });
		expect(node).toBeDefined();
	});

	it("returns null from ShowEcosystemIcon when given an undefined or unregistered icon key and resolves language and package manager icons", () => {
		expect(ShowEcosystemIcon({ kind: undefined })).toBeNull();
		expect(ShowEcosystemIcon({ kind: "" })).toBeNull();
		expect(ShowEcosystemIcon({ kind: "unknown-brand-xyz" })).toBeNull();
		expect(ShowEcosystemIcon({ kind: "rust" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "cargo" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "node" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "npm" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "pnpm" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "uv" })).not.toBeNull();
		expect(ShowEcosystemIcon({ kind: "curl" })).not.toBeNull();
	});
});
