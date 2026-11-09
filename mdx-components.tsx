// mdx-components.tsx
import { Callout } from "fumadocs-ui/components/callout";
import { File, Files as FileTree, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
	BuildTomlExplorer,
	ShowCommandRef,
	ShowInlineVersionBadge,
	ShowOsvPayloadPreview,
	ShowTerminalReplay,
} from "@/components";

/**
 * Returns merged MDX components for Fumadocs rendering.
 */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		...components,
		Callout,
		Tabs,
		Tab,
		Steps,
		Step,
		FileTree,
		Folder,
		File,
		BuildTomlExplorer,
		CommandRef: ShowCommandRef,
		InlineVersionBadge: ShowInlineVersionBadge,
		OsvPayloadPreview: ShowOsvPayloadPreview,
		ShowCommandRef,
		ShowInlineVersionBadge,
		ShowOsvPayloadPreview,
		ShowTerminalReplay,
		TerminalReplay: ShowTerminalReplay,
		TomlBuilder: BuildTomlExplorer,
	};
}
