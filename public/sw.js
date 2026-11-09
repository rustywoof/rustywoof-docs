const CACHE_NAME = "rustywoof-cache-v00";

const PRECACHE_URLS = [
	"/",
	"/docs",
	"/docs/cli",
	"/docs/cli/scan",
	"/docs/cli/check",
	"/docs/cli/hook",
	"/docs/cli/init",
	"/docs/cli/audit",
	"/docs/cli/remediate",
	"/docs/cli/sniff",
	"/docs/cli/patrol",
	"/docs/cli/cache",
	"/docs/cli/generate",
	"/docs/cli/version",
	"/docs/cli/update",
	"/docs/concepts",
	"/docs/concepts/perimeter-defense",
	"/docs/concepts/secret-scanning",
	"/docs/concepts/supply-chain",
	"/docs/configuration",
	"/docs/configuration/custom-rules",
	"/docs/configuration/woof-toml",
	"/docs/installation",
];

function getCacheStrategy(url, destination, mode) {
	if (
		url.includes("/_next/static/") ||
		url.endsWith(".woff2") ||
		url.endsWith(".wasm") ||
		url.endsWith(".png") ||
		url.endsWith(".svg")
	) {
		return "cache-first";
	}
	if (
		url.includes("/_pagefind/") ||
		destination === "document" ||
		mode === "navigate" ||
		url.endsWith(".html") ||
		url.endsWith(".txt")
	) {
		return "stale-while-revalidate";
	}
	return "network-only";
}

// Cached responses must not carry the "redirected" flag when served
// for navigation requests, so rebuild the response without it.
async function cleanResponse(res) {
	if (!res.redirected) return res;
	const body = await res.blob();
	return new Response(body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers,
	});
}

// Fetch one URL, store it, and return its body text if it was HTML.
async function precacheOne(cache, path) {
	const res = await fetch(path, { credentials: "same-origin" });
	if (!res.ok) throw new Error(`${path} -> ${res.status}`);

	const isHtml = (res.headers.get("Content-Type") || "").includes("text/html");
	const html = isHtml ? await res.clone().text() : "";
	await cache.put(path, await cleanResponse(res));
	return html;
}

async function precacheAll() {
	const cache = await caches.open(CACHE_NAME);
	const assets = new Set();

	// Pages: tolerate individual failures instead of aborting everything.
	const pageResults = await Promise.allSettled(
		PRECACHE_URLS.map(async (path) => {
			const html = await precacheOne(cache, path);
			const matches = html.match(/\/_next\/static\/[^"'\\\s)<>]+/g) || [];
			for (const m of matches) assets.add(m);
		}),
	);
	pageResults.forEach((r, i) => {
		if (r.status === "rejected")
			console.warn("[sw] precache page failed:", PRECACHE_URLS[i], r.reason);
	});

	// Assets (JS/CSS/fonts) referenced by those pages.
	const assetList = [...assets];
	const assetResults = await Promise.allSettled(
		assetList.map(async (path) => {
			if (await cache.match(path)) return;
			const res = await fetch(path);
			if (!res.ok) throw new Error(`${path} -> ${res.status}`);
			await cache.put(path, res);
		}),
	);
	assetResults.forEach((r, i) => {
		if (r.status === "rejected")
			console.warn("[sw] precache asset failed:", assetList[i], r.reason);
	});
}

self.addEventListener("install", (event) => {
	event.waitUntil(precacheAll().catch((err) => console.error("[sw] precache failed:", err)));
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;
	const url = event.request.url;
	const strategy = getCacheStrategy(url, event.request.destination, event.request.mode);

	if (strategy === "cache-first") {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE_NAME);
				const cached = await cache.match(event.request);
				if (cached) return cached;

				try {
					const res = await fetch(event.request);
					if (res && res.status === 200 && res.type === "basic") {
						event.waitUntil(cache.put(event.request, res.clone()));
					}
					return res;
				} catch {
					return new Response("Offline", {
						status: 503,
						headers: { "Content-Type": "text/plain" },
					});
				}
			})(),
		);
	} else if (strategy === "stale-while-revalidate") {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE_NAME);
				const cached = await cache.match(event.request);

				const network = fetch(event.request)
					.then(async (res) => {
						if (res && res.status === 200 && res.type === "basic") {
							const toCache = await cleanResponse(res.clone());
							event.waitUntil(cache.put(event.request, toCache));
						}
						return res;
					})
					.catch(async () => {
						if (cached) return cached;
						if (event.request.mode === "navigate") {
							const fallback = await cache.match("/");
							if (fallback) return fallback;
						}
						return new Response("Offline", {
							status: 503,
							headers: { "Content-Type": "text/plain" },
						});
					});

				if (cached) {
					event.waitUntil(network);
					return cached;
				}
				return network;
			})(),
		);
	}
});
