// src/app/layout.tsx

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import { ProvideSmoothScroll, RegisterPwa, ShowReleaseBanner } from "@/components";
import { getLatestVersionTag } from "@/lib";
import "katex/dist/katex.min.css";
import "@/app/globals.css";

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-ibm-sans",
	display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-ibm-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Rustywoof",
	description: "Local secret scanner and OSV lockfile auditor written in Rust.",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f2f2f2" },
		{ media: "(prefers-color-scheme: dark)", color: "#161618" },
	],
	colorScheme: "dark light",
};

/**
 * Root layout providing fonts, PWA registry, release announcement banner, and smooth scroll.
 */
export default async function RootLayout({
	children,
}: {
	readonly children: ReactNode;
}): Promise<ReactElement> {
	const latestVersion = await getLatestVersionTag();

	return (
		<html
			lang="en"
			dir="ltr"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
		>
			<body className="rw-body">
				<RootProvider theme={{ enabled: true, defaultTheme: "system" }}>
					<RegisterPwa />
					<ShowReleaseBanner version={latestVersion} />
					<ProvideSmoothScroll>{children}</ProvideSmoothScroll>
				</RootProvider>
			</body>
		</html>
	);
}
