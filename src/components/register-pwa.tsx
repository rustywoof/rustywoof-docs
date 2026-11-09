// src/components/register-pwa.tsx
"use client";

import { useEffect } from "react";

/**
 * Registers the client-side service worker for offline caching in production only.
 */
export function RegisterPwa(): null {
	useEffect(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
		if (process.env.NODE_ENV === "production") {
			navigator.serviceWorker.register("/sw.js").catch(() => {});
		} else {
			navigator.serviceWorker.getRegistrations().then((regs) => {
				for (const reg of regs) {
					reg.unregister().catch(() => {});
				}
			});
		}
	}, []);
	return null;
}
