// src/app/page.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactElement } from "react";
import { ShowHomeContent } from "@/components";
import { baseOptions } from "./layout.config";

/**
 * Renders the root homepage with terminal showcases and benchmarks.
 */
export default function HomePage(): ReactElement {
	return (
		<HomeLayout {...baseOptions}>
			<main>
				<ShowHomeContent />
			</main>
		</HomeLayout>
	);
}
