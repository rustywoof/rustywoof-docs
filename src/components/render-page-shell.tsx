// src/components/render-page-shell.tsx
import type { ReactElement, ReactNode } from "react";

interface RenderPageShellProps {
	readonly children: ReactNode;
}

/**
 * Full-width container that shares the navbar gutter, so content lines up with the nav.
 */
export function RenderPageShell({ children }: RenderPageShellProps): ReactElement {
	return <div className="rw-gutter w-full py-10">{children}</div>;
}
