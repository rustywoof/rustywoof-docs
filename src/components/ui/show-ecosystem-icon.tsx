// src/components/ui/show-ecosystem-icon.tsx
import {
	Bun,
	Javascript,
	Json,
	NodejsIcon,
	NpmIcon,
	Pnpm,
	Python,
	Terminal,
	Toml,
	TypescriptIcon,
	Uv,
	Yarn,
} from "@dev.icons/react";
import { BashIcon, Curl, Deno, Rust } from "@dev.icons/react/mono";
import type { ReactElement } from "react";
import { ShowGithubBrandIcon } from "./show-github-brand-icon";

const SIZE = 15;

const BRAND_ICONS: Record<string, () => ReactElement> = {
	rust: () => <Rust size={SIZE} color="currentColor" aria-hidden />,
	cargo: () => <Rust size={SIZE} color="currentColor" aria-hidden />,
	ts: () => <TypescriptIcon size={SIZE} color="default" aria-hidden />,
	js: () => <Javascript size={SIZE} color="default" aria-hidden />,
	node: () => <NodejsIcon size={SIZE} color="default" aria-hidden />,
	python: () => <Python size={SIZE} color="default" aria-hidden />,
	npm: () => <NpmIcon size={SIZE} color="default" aria-hidden />,
	pnpm: () => <Pnpm size={SIZE} color="default" aria-hidden />,
	yarn: () => <Yarn size={SIZE} color="default" aria-hidden />,
	bun: () => <Bun size={SIZE} color="currentColor" aria-hidden />,
	deno: () => <Deno size={SIZE} color="currentColor" aria-hidden />,
	pypi: () => <Python size={SIZE} color="default" aria-hidden />,
	pipx: () => <Python size={SIZE} color="default" aria-hidden />,
	uv: () => <Uv size={SIZE} color="default" aria-hidden />,
	poetry: () => <Python size={SIZE} color="default" aria-hidden />,
	bash: () => <BashIcon size={SIZE} color="default" aria-hidden />,
	sh: () => <BashIcon size={SIZE} color="default" aria-hidden />,
	curl: () => <Curl size={SIZE} color="default" aria-hidden />,
	terminal: () => <Terminal size={SIZE} color="default" aria-hidden />,
	toml: () => <Toml size={SIZE} color="default" aria-hidden />,
	json: () => <Json size={SIZE} color="default" aria-hidden />,
	github: () => <ShowGithubBrandIcon />,
};

/**
 * Renders only official brand icons. Returns null for any non-brand key.
 */
export function ShowEcosystemIcon({
	kind,
}: {
	readonly kind?: string | undefined;
}): ReactElement | null {
	if (!kind) return null;
	const render = BRAND_ICONS[kind];
	if (!render) return null;
	return <span className="inline-flex shrink-0 items-center leading-none">{render()}</span>;
}
