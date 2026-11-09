// src/components/ui/show-copy-icon.tsx
import type { ReactElement, SVGProps } from "react";
import { RenderBaseIcon } from "./render-base-icon";

/**
 * Renders a crisp, architectural clipboard copy icon.
 */
export function ShowCopyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
	return (
		<RenderBaseIcon {...props}>
			<rect x="8" y="8" width="12" height="12" />
			<path d="M4 16V4h12" />
		</RenderBaseIcon>
	);
}
