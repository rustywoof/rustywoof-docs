// src/components/render-command-examples.tsx
import type { ReactElement } from "react";
import { ShowTerminalWindow } from "@/components/ui";
import type { ExampleDef } from "@/lib";

interface RenderCommandExamplesProps {
	readonly examples: readonly ExampleDef[];
}

/**
 * Renders executable CLI examples using uniform ShowTerminalWindow components.
 */
export function RenderCommandExamples({ examples }: RenderCommandExamplesProps): ReactElement {
	return (
		<div className="flex flex-col gap-6">
			{examples.map((ex) => {
				const lines = [
					{ id: "cmd", text: `$ ${ex.command}`, tone: "accent" as const },
					...ex.output.split("\n").map((text, i) => ({ id: `out-${i}`, text })),
				];
				return (
					<div key={`${ex.command}:${ex.explanation}`} className="flex flex-col gap-3">
						<ShowTerminalWindow title={ex.command} lines={lines} />
						<p className="m-0 text-base text-(--text-secondary)">{ex.explanation}</p>
					</div>
				);
			})}
		</div>
	);
}
