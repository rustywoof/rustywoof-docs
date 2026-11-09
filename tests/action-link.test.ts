// tests/action-link.test.ts
import { describe, expect, it } from "vitest";
import { copyText, ShowActionButton, ShowActionLink, ShowCliTabBar } from "@/components/ui";
import { getProps } from "./test-utils";

/**
 * Validates ShowActionLink and ShowActionButton boundary states, active attributes, and external link security.
 */
describe("ShowActionLink and ShowActionButton boundary states", () => {
	it("renders an external anchor with target=_blank and rel=noopener noreferrer when external=true", () => {
		const el = ShowActionLink({
			href: "https://github.com/ianramy/rustywoof",
			external: true,
			children: "GitHub",
		});
		const props = getProps(el);
		expect(el.type).toBe("a");
		expect(props.target).toBe("_blank");
		expect(props.rel).toBe("noopener noreferrer");
		expect(String(props.className)).toContain("rw-pill-soft");
	});

	it("applies primary and small pill classes when variant=primary and size=sm", () => {
		const el = ShowActionLink({
			href: "/docs",
			variant: "primary",
			size: "sm",
			className: "custom-cls",
			children: "Docs",
		});
		const props = getProps(el);
		expect(String(props.className)).toContain("rw-pill-primary");
		expect(String(props.className)).toContain("rw-pill-sm");
		expect(String(props.className)).toContain("custom-cls");
	});

	it("sets role=tab, aria-selected, data-active, and non-pill rw-tab class on ShowActionButton", () => {
		const tabActive = ShowActionButton({
			id: "tab:scan",
			role: "tab",
			active: true,
			onClick: () => {},
			children: "Scan",
		});
		const activeProps = getProps(tabActive);
		expect(activeProps.role).toBe("tab");
		expect(activeProps["aria-selected"]).toBe(true);
		expect(activeProps["data-active"]).toBe(true);
		expect(String(activeProps.className)).toContain("rw-tab");
		expect(String(activeProps.className)).not.toContain("rw-pill");
		expect(activeProps["data-visited"]).toBeUndefined();

		const btnInactive = ShowActionButton({
			onClick: () => {},
			children: "Reset",
		});
		const inactiveProps = getProps(btnInactive);
		expect(inactiveProps.role).toBeUndefined();
		expect(inactiveProps["data-active"]).toBe(false);
	});
});

describe("ShowCliTabBar and copyText boundary states", () => {
	it("renders ShowCliTabBar with an empty items array without throwing", () => {
		const bar = ShowCliTabBar({ items: [], activeId: "none", onSelect: () => {} });
		const props = getProps(bar);
		expect(props.role).toBe("tablist");
		expect(props.children).toEqual([]);
	});

	it("returns false from copyText when navigator.clipboard is unavailable in Node", async () => {
		expect(await copyText("woof scan")).toBe(false);
	});
});
