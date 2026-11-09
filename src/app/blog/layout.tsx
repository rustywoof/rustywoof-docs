// src/app/blog/layout.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactElement, ReactNode } from "react";
import { RenderPageShell } from "@/components";
import { baseOptions } from "../layout.config";

/**
 * Wraps blog routes in the shared top navigation and page shell.
 */
export default function BlogLayout({ children }: { readonly children: ReactNode }): ReactElement {
	return (
		<HomeLayout {...baseOptions}>
			<RenderPageShell>{children}</RenderPageShell>
		</HomeLayout>
	);
}
