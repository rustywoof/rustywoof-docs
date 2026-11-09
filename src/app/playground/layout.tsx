// src/app/playground/layout.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactElement, ReactNode } from "react";
import { baseOptions } from "../layout.config";

/**
 * Wraps the playground route in the shared top navigation layout.
 */
export default function PlaygroundLayout({
	children,
}: {
	readonly children: ReactNode;
}): ReactElement {
	return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
