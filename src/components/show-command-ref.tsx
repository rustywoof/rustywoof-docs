// src/components/show-command-ref.tsx
import type { ReactElement, ReactNode } from "react";
import { ShowTerminalWindow } from "@/components/ui";
import { CLI_REFERENCE, type CommandDef, commandSections } from "@/lib";
import { RenderBulletList } from "./render-bullet-list";
import { RenderCommandExamples } from "./render-command-examples";
import { RenderFlagsTable } from "./render-flags-table";

interface ShowCommandRefProps {
	readonly name: string;
}

/**
 * Renders a titled section with an anchor id matching table-of-contents metadata.
 */
function RenderSection({
	id,
	title,
	children,
}: {
	readonly id: string;
	readonly title: string;
	readonly children: ReactNode;
}): ReactElement {
	return (
		<section>
			<h2
				id={id}
				className="mb-3 scroll-mt-24 text-2xl font-semibold tracking-tight text-(--text-primary)"
			>
				{title}
			</h2>
			{children}
		</section>
	);
}

/**
 * Builds the section content dictionary for a resolved CLI command definition.
 */
function buildCommandSectionMap(cmd: CommandDef): Record<string, ReactNode> {
	return {
		purpose: <p className="m-0 text-base text-(--text-secondary)">{cmd.purpose}</p>,
		synopsis: (
			<ShowTerminalWindow
				label="Synopsis"
				title={cmd.synopsis}
				lines={[{ id: "syn", text: `$ ${cmd.synopsis}`, tone: "accent" }]}
			/>
		),
		flags: <RenderFlagsTable flags={cmd.flags} />,
		"edge-cases": <RenderBulletList items={cmd.edgeCases ?? []} />,
		"common-mistakes": <RenderBulletList items={cmd.commonMistakes ?? []} />,
		"exit-codes": (
			<ul className="m-0 flex list-none flex-col gap-2 p-0">
				{Object.entries(cmd.exitCodes).map(([code, meaning]) => (
					<li key={code} className="flex items-start gap-4">
						<span className="min-w-8 font-mono font-semibold text-(--text-primary)">{code}</span>
						<span className="text-base text-(--text-secondary)">{meaning}</span>
					</li>
				))}
			</ul>
		),
		examples: <RenderCommandExamples examples={cmd.examples} />,
	};
}

/**
 * Renders a CLI command page. Headings carry ids that match commandSections().
 */
export function ShowCommandRef({ name }: ShowCommandRefProps): ReactElement {
	const cmd = CLI_REFERENCE[name];
	if (!cmd) {
		return (
			<div className="rounded-xl border border-(--danger) p-4 text-(--danger)">
				Command definition not found: {name}
			</div>
		);
	}
	const body = buildCommandSectionMap(cmd);

	return (
		<div className="mt-8 flex flex-col gap-10">
			{commandSections(cmd).map((s) => (
				<RenderSection key={s.id} id={s.id} title={s.title}>
					{body[s.id]}
				</RenderSection>
			))}
		</div>
	);
}
