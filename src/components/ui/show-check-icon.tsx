// src/components/ui/show-check-icon.tsx
import type { ReactElement, SVGProps } from "react";
import { RenderBaseIcon } from "./render-base-icon";

/**
 * Renders a crisp checkmark confirmation icon.
 */
export function ShowCheckIcon(props: SVGProps<SVGSVGElement>): ReactElement {
	return (
		<RenderBaseIcon {...props}>
			<polyline points="20 6 9 17 4 12" />
		</RenderBaseIcon>
	);
}
