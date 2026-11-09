// src/components/ui/render-base-icon.tsx
import type { ReactElement, ReactNode, SVGProps } from "react";

interface RenderBaseIconProps extends SVGProps<SVGSVGElement> {
	readonly children: ReactNode;
}

/**
 * Renders the shared architectural SVG container for geometric icons.
 */
export function RenderBaseIcon({ children, ...props }: RenderBaseIconProps): ReactElement {
	return (
		<svg
			width={15}
			height={15}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.85}
			strokeLinecap="square"
			strokeLinejoin="miter"
			aria-hidden="true"
			{...props}
		>
			{children}
		</svg>
	);
}
