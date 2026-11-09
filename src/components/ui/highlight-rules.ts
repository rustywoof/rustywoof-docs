// src/components/ui/highlight-rules.ts
export type Lang = "ts" | "rust" | "python" | "toml" | "json" | "text";

export interface Rule {
	readonly cls: string;
	readonly re: RegExp;
	readonly bol?: boolean;
}

const KEYWORDS: Partial<Record<Lang, string>> = {
	ts: "import|export|from|const|let|var|function|return|if|else|new|async|await|type|interface|class|extends|default|as|of|for|while|true|false|null|undefined",
	rust: "pub|struct|fn|let|mut|const|static|impl|use|mod|enum|match|if|else|for|while|return|self|Self|true|false|crate|as|in|where|trait|type|unsafe|move|ref",
	python:
		"import|from|as|def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|with|try|except|finally|raise|lambda|pass|yield|async|await",
	toml: "true|false",
	json: "true|false|null",
};

const NUMBER: Rule = { cls: "rw-tok-num", re: /\b\d+(?:\.\d+)?\b/y };
const PUNCT: Rule = { cls: "rw-tok-punct", re: /[{}()[\];,.:<>=+\-*/&|!?]+/y };
const CONST: Rule = { cls: "rw-tok-const", re: /\b[A-Z][A-Z0-9_]{2,}\b/y };
const TYPE: Rule = { cls: "rw-tok-type", re: /\b[A-Z][A-Za-z0-9_]*\b/y };
const FN: Rule = { cls: "rw-tok-fn", re: /\b[a-z_][A-Za-z0-9_]*(?=\()/y };
const RUST_PRIM: Rule = {
	cls: "rw-tok-type",
	re: /\b(?:str|bool|char|u8|u16|u32|u64|usize|i8|i16|i32|i64|isize|f32|f64)\b/y,
};

/**
 * Compiles a sticky keyword regex rule for the given language.
 */
function buildKeywordRules(lang: Lang): Rule[] {
	const words = KEYWORDS[lang];
	return words ? [{ cls: "rw-tok-kw", re: new RegExp(`\\b(?:${words})\\b`, "y") }] : [];
}

export const RULES: Record<Lang, readonly Rule[]> = {
	ts: [
		{ cls: "rw-tok-comment", re: /\/\/.*/y },
		{ cls: "rw-tok-str", re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/y },
		NUMBER,
		...buildKeywordRules("ts"),
		CONST,
		TYPE,
		FN,
		PUNCT,
	],
	rust: [
		{ cls: "rw-tok-comment", re: /\/\/.*/y },
		{ cls: "rw-tok-type", re: /'[A-Za-z_]+(?!['\w])/y },
		{ cls: "rw-tok-str", re: /"(?:[^"\\]|\\.)*"/y },
		NUMBER,
		...buildKeywordRules("rust"),
		RUST_PRIM,
		CONST,
		TYPE,
		FN,
		PUNCT,
	],
	python: [
		{ cls: "rw-tok-comment", re: /#.*/y },
		{ cls: "rw-tok-str", re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y },
		NUMBER,
		...buildKeywordRules("python"),
		CONST,
		TYPE,
		FN,
		PUNCT,
	],
	toml: [
		{ cls: "rw-tok-comment", re: /#.*/y },
		{ cls: "rw-tok-type", re: /\[[A-Za-z0-9_.-]+\]/y, bol: true },
		{ cls: "rw-tok-prop", re: /[A-Za-z_][\w.-]*(?=\s*=)/y },
		{ cls: "rw-tok-str", re: /"(?:[^"\\]|\\.)*"|'[^']*'/y },
		NUMBER,
		...buildKeywordRules("toml"),
		PUNCT,
	],
	json: [
		{ cls: "rw-tok-prop", re: /"(?:[^"\\]|\\.)*"(?=\s*:)/y },
		{ cls: "rw-tok-str", re: /"(?:[^"\\]|\\.)*"/y },
		NUMBER,
		...buildKeywordRules("json"),
		PUNCT,
	],
	text: [],
};
