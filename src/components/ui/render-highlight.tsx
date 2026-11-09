// src/components/ui/render-highlight.tsx
import type { ReactElement } from "react";
import { type Lang, RULES, type Rule } from "./highlight-rules";

interface Token {
	readonly pos: number;
	readonly text: string;
	readonly cls?: string;
}

/**
 * Matches the first sticky syntax rule at character offset `i` within `line`.
 */
function matchRuleAt(line: string, i: number, rules: readonly Rule[]): Token | null {
	for (const rule of rules) {
		if (rule.bol && i !== 0) continue;
		rule.re.lastIndex = i;
		const m = rule.re.exec(line);
		if (m && m[0].length > 0) return { pos: i, text: m[0], cls: rule.cls };
	}
	return null;
}

/**
 * Tokenizes a single source line into styled and plain text spans.
 */
function tokenize(line: string, lang: Lang): Token[] {
	const rules = RULES[lang];
	const out: Token[] = [];
	let plain = "";
	let plainStart = 0;
	let i = 0;
	while (i < line.length) {
		const hit = matchRuleAt(line, i, rules);
		if (hit) {
			if (plain) out.push({ pos: plainStart, text: plain });
			plain = "";
			out.push(hit);
			i += hit.text.length;
			plainStart = i;
		} else {
			if (!plain) plainStart = i;
			plain += line[i];
			i += 1;
		}
	}
	if (plain) out.push({ pos: plainStart, text: plain });
	return out;
}

interface RenderHighlightProps {
	readonly text: string;
	readonly lang: Lang;
}

/**
 * Renders a syntax-highlighted code line for the specified language.
 */
export function RenderHighlight({ text, lang }: RenderHighlightProps): ReactElement {
	return (
		<>
			{tokenize(text, lang).map((t) =>
				t.cls ? (
					<span key={t.pos} className={t.cls}>
						{t.text}
					</span>
				) : (
					t.text
				),
			)}
		</>
	);
}
