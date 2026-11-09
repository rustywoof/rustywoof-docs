// src/app/not-found.tsx
import type { ReactElement } from "react";

/**
 * Renders the fallback 404 Not Found page.
 */
export default function NotFound(): ReactElement {
	return (
		<div style={{ textAlign: "center", padding: "100px" }}>
			<h1>404 - Page Not Found</h1>
		</div>
	);
}
