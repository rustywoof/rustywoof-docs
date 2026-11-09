// tests/test-utils.ts
import type { ReactElement } from "react";

/**
 * Validates that an unknown value is a non-null object record.
 */
export function isRecord(val: unknown): val is Record<string, unknown> {
	return typeof val === "object" && val !== null;
}

/**
 * Extracts element properties safely without type assertions.
 */
export function getProps(element: ReactElement): Record<string, unknown> {
	if (isRecord(element.props)) return element.props;
	return {};
}
