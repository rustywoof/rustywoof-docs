// src/app/layout.config.tsx
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ShowSiteLogo } from "@/components";

export const baseOptions: BaseLayoutProps = {
	githubUrl: "https://github.com/ianramy/rustywoof",
	nav: {
		title: <ShowSiteLogo />,
	},
	links: [
		{ text: "Documentation", url: "/docs", active: "nested-url" },
		{ text: "Playground", url: "/playground", active: "nested-url" },
		{ text: "Blog", url: "/blog", active: "nested-url" },
		{ text: "Releases", url: "/versions", active: "nested-url" },
	],
};
