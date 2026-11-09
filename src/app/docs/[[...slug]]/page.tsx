// src/app/docs/[[...slug]]/page.tsx
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ShowPageActions, ShowPageFeedback } from "@/components";
import { CLI_REFERENCE, commandSections, docsSource } from "@/lib";
import { useMDXComponents } from "@/mdx-components";

interface PageProps {
	readonly params: Promise<{ readonly slug?: string[] }>;
}

const REPO_BLOB = "https://github.com/rustywoof/rustywoof-docs/blob/main/src/app/docs";

/**
 * Formats a Date object as DD/MM/YYYY in UTC.
 */
function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

/**
 * Resolves the table of contents for dynamic CLI pages or standard documentation pages.
 */
function resolvePageToc(slug: readonly string[], defaultToc: TOCItemType[]): TOCItemType[] {
	// Why: CLI pages render their headings inside CommandRef at runtime, so we derive their TOC from CLI_REFERENCE.
	const command = slug[0] === "cli" && slug[1] ? CLI_REFERENCE[slug[1]] : undefined;
	if (command) {
		return commandSections(command).map((s) => ({ title: s.title, url: `#${s.id}`, depth: 2 }));
	}
	return defaultToc;
}

/**
 * Generates static route parameters for all MDX documentation pages.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
	return docsSource.generateParams();
}

/**
 * Generates page-level SEO metadata for a documentation route.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = docsSource.getPage(params.slug);
	if (!page) notFound();
	return { title: `${page.data.title} | Rustywoof`, description: page.data.description };
}

/**
 * Renders a docs page with actions, TOC (including CLI pages), feedback and last-updated.
 */
export default async function Page(props: PageProps): Promise<ReactElement> {
	const params = await props.params;
	const page = docsSource.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;
	const components = useMDXComponents();
	const slug = params.slug ?? [];
	const toc = resolvePageToc(slug, page.data.toc);
	const lastModified = (page.data as { lastModified?: Date }).lastModified;
	const urlPath = `/docs${slug.length ? `/${slug.join("/")}` : ""}`;

	return (
		<DocsPage toc={toc} full={page.data.full}>
			<DocsTitle>{page.data.title}</DocsTitle>
			{page.data.description ? <DocsDescription>{page.data.description}</DocsDescription> : null}
			<div className="mb-8">
				<ShowPageActions
					markdownPath={`/llms.mdx${urlPath}`}
					githubUrl={`${REPO_BLOB}/${page.path}`}
				/>
			</div>
			<DocsBody>
				<MDX components={components} />
			</DocsBody>
			<div className="mt-14 flex flex-col gap-4 border-t border-(--border) pt-6">
				<ShowPageFeedback path={urlPath} />
				{lastModified ? (
					<p className="m-0 text-sm text-(--text-secondary)">
						Last updated on {formatDate(lastModified)}
					</p>
				) : null}
			</div>
		</DocsPage>
	);
}
