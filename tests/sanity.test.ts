// tests/sanity.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

/**
 * Validates theme token structure, manifest alignment, and absence of legacy visited-state tokens.
 */
describe("Theme and manifest structural integrity", () => {
	const cssPath = path.join(process.cwd(), "src", "app", "globals.css");
	const cssContent = fs.readFileSync(cssPath, "utf8");
	const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
	const layoutContent = fs.readFileSync(layoutPath, "utf8");

	it("defines matching light and dark surface and accent tokens without pure #ffffff or #000000", () => {
		expect(cssContent).toContain("--surface: #f2f2f2;");
		expect(cssContent).toContain("--surface: #161618;");
		expect(cssContent).toContain("--accent: #bc6500;");
		expect(cssContent).toContain("--accent: #f59e0b;");
		expect(cssContent).not.toMatch(/--surface:\s*#(?:fff|ffffff|000|000000)\b/i);
	});

	it("excludes legacy purple visited-state variables and Nextra selectors from globals.css", () => {
		expect(cssContent).not.toContain("--btn-visited");
		expect(cssContent).not.toContain("--btn-blue");
		expect(cssContent).not.toContain("data-visited");
		expect(cssContent).not.toContain("nextra");
	});

	it("aligns PWA manifest and viewport theme colors with the global CSS palette", () => {
		const data = manifest();
		expect(data.background_color).toBe("#f2f2f2");
		expect(data.theme_color).toBe("#bc6500");
		expect(layoutContent).toContain('color: "#f2f2f2"');
		expect(layoutContent).toContain('color: "#161618"');
	});
});
