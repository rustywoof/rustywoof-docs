// src/components/provide-smooth-scroll.tsx
"use client";

import Lenis from "lenis";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";

/**
 * Initializes a Lenis smooth scrolling instance and starts its animation loop.
 */
function createSmoothScroll(): Lenis {
	const lenis = new Lenis({
		duration: 0.8,
		easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
		orientation: "vertical",
		gestureOrientation: "vertical",
		smoothWheel: true,
		touchMultiplier: 2,
	});
	const raf = (time: number): void => {
		lenis.raf(time);
		requestAnimationFrame(raf);
	};
	requestAnimationFrame(raf);
	return lenis;
}

/**
 * Provides smooth vertical scrolling when reduced motion is not enabled.
 */
export function ProvideSmoothScroll({ children }: { readonly children: ReactNode }): ReactElement {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const lenis = createSmoothScroll();
		const handleHashChange = (event: HashChangeEvent): void => {
			const hash = new URL(event.newURL).hash;
			const target = hash ? document.querySelector(hash) : null;
			if (target) lenis.scrollTo(target as HTMLElement);
		};
		window.addEventListener("hashchange", handleHashChange);
		return () => {
			window.removeEventListener("hashchange", handleHashChange);
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}
