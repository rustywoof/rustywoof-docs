// src/components/home/show-hero-section.tsx
import type { ReactElement } from "react";
import { ShowActionLink, ShowGroupedCliTabs } from "@/components/ui";
import { INSTALL_GROUPS } from "./home-data";

/**
 * Renders the hero with pill CTAs and the install tabs.
 */
export function ShowHeroSection(): ReactElement {
	return (
		<section className="rw-animate-in grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
			<div className="flex flex-col items-start gap-6 lg:col-span-6">
				<span className="rounded-full border border-(--border-strong) bg-(--surface-raised) px-4 py-1.5 font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-(--accent)">
					Local-first security auditor
				</span>
				<h1 className="m-0 text-4xl sm:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-(--text-primary)">
					Keep leaked keys and bad packages <span className="text-(--accent)">out of git.</span>
				</h1>
				<p className="m-0 max-w-2xl text-lg sm:text-xl lg:text-2xl leading-relaxed text-(--text-secondary)">
					Rustywoof checks your code for hardcoded credentials and checks your lockfiles against the
					OSV database. Everything runs locally on your machine with no telemetry.
				</p>
				<div className="flex flex-wrap items-center gap-4 pt-3">
					<ShowActionLink href="/docs" variant="primary">
						Read the docs
					</ShowActionLink>
					<ShowActionLink href="/playground">Open the playground</ShowActionLink>
				</div>
			</div>
			<div className="w-full min-w-0 lg:col-span-6">
				<ShowGroupedCliTabs groups={INSTALL_GROUPS} />
			</div>
		</section>
	);
}
