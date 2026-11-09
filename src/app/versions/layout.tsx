// src/app/versions/layout.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactElement, ReactNode } from "react";
import { RenderPageShell } from "@/components";
import { baseOptions } from "../layout.config";

/**
 * Wraps versions and release history pages in the shared top navigation and page shell.
 */
export default function VersionsLayout({
	children,
}: {
	readonly children: ReactNode;
}): ReactElement {
	return (
		<HomeLayout {...baseOptions}>
			<RenderPageShell>{children}</RenderPageShell>
		</HomeLayout>
	);
}
