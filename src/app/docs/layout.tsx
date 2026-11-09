// src/app/docs/layout.tsx
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { docsSource } from "@/lib";
import { baseOptions } from "../layout.config";

/**
 * Wraps DocsLayout inside HomeLayout so Docs shares the exact same top navbar
 * (Logo, Documentation, Playground, Blog, Releases, Search Ctrl+K, Theme Toggle, GitHub)
 * as the Homepage, while keeping the left sidebar strictly for the docs page tree.
 */
export default function Layout({ children }: { readonly children: ReactNode }) {
	return (
		<HomeLayout {...baseOptions} className="rw-docs-shell">
			<DocsLayout
				tree={docsSource.pageTree}
				nav={{
					enabled: true,
					title: (
						<span className="font-mono text-sm font-semibold text-(--text-primary)">
							Documentation
						</span>
					),
				}}
				searchToggle={{ enabled: false }}
				themeSwitch={{ enabled: false }}
				links={[]}
				sidebar={{ defaultOpenLevel: 1, collapsible: true }}
				containerProps={{
					className: "rw-docs-container",
				}}
			>
				{children}
			</DocsLayout>
		</HomeLayout>
	);
}
