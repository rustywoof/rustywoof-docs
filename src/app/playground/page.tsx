// src/app/playground/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ShowPlayground } from "@/components";

export const metadata: Metadata = {
	title: "Interactive Playground | Rustywoof",
	description:
		"Run woof scan, woof check, live OSV woof audit, woof sniff, and .woof.toml validation directly in your browser.",
};

/**
 * Renders the browser playground with WASM secret scanner and OSV lockfile auditor.
 */
export default function PlaygroundPage(): ReactElement {
	return (
		<main className="rw-gutter w-full max-w-none py-12 pb-24">
			<section className="flex w-full flex-col gap-8">
				<div className="flex max-w-4xl flex-col gap-3">
					<span className="font-mono text-sm font-semibold uppercase tracking-widest text-(--accent)">
						Interactive Workbench · scan · check · audit · sniff · init
					</span>
					<h1 className="m-0 text-4xl sm:text-5xl font-bold tracking-tight text-(--text-primary)">
						Rustywoof Security Playground
					</h1>
					<p className="m-0 text-lg sm:text-xl leading-relaxed text-(--text-secondary)">
						Drop in a <code>package.json</code>, <code>Cargo.lock</code>, or Python lockfile to
						audit dependencies against OSV, test secret detection via the client-side WASM
						Aho-Corasick automaton, and validate <code>.woof.toml</code> policies in memory.
					</p>
				</div>
				<ShowPlayground />
			</section>
		</main>
	);
}
