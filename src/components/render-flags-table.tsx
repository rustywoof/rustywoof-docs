// src/components/render-flags-table.tsx
import type { ReactElement } from "react";
import type { FlagDef } from "@/lib";
import { ShowInlineVersionBadge } from "./show-inline-version-badge";

interface RenderFlagsTableProps {
	readonly flags: readonly FlagDef[];
}

/**
 * Renders the CLI flag reference table for a command.
 */
export function RenderFlagsTable({ flags }: RenderFlagsTableProps): ReactElement {
	return (
		<div className="overflow-x-auto rounded-xl border border-(--border)">
			<table className="w-full text-left text-base text-(--text-secondary)">
				<thead className="bg-(--surface-raised) text-(--text-primary)">
					<tr>
						<th className="px-4 py-2.5 font-semibold">Flag</th>
						<th className="px-4 py-2.5 font-semibold">Type</th>
						<th className="px-4 py-2.5 font-semibold">Description</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-(--border)">
					{flags.map((flag) => (
						<tr key={flag.name}>
							<td className="whitespace-nowrap px-4 py-3 align-top font-mono text-(--text-primary)">
								{flag.name}
								{flag.added || flag.deprecated ? (
									<ShowInlineVersionBadge added={flag.added} deprecated={flag.deprecated} />
								) : null}
							</td>
							<td className="px-4 py-3 align-top">{flag.type}</td>
							<td className="px-4 py-3 align-top">
								{flag.description}
								{flag.defaultValue ? (
									<span className="mt-1 block text-sm">
										Default:{" "}
										<code className="font-mono text-(--text-primary)">{flag.defaultValue}</code>
									</span>
								) : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
