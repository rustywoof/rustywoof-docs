// src/app/llms.mdx/docs/[[...slug]]/route.ts
import { notFound } from "next/navigation";
import { CLI_REFERENCE, commandToMarkdown, docsSource } from "@/lib";

export const revalidate = false;

/**
 * Generates static route params for LLM markdown documents.
 */
export function generateStaticParams(): Array<{ slug: string[] }> {
	return docsSource.generateParams();
}

/**
 * Serves a docs page as plain Markdown for "Copy Markdown" and AI tools.
 */
export async function GET(
	_request: Request,
	context: { params: Promise<{ slug?: string[] }> },
): Promise<Response> {
	const { slug } = await context.params;
	const page = docsSource.getPage(slug);
	if (!page) notFound();

	const command = slug?.[0] === "cli" && slug[1] ? CLI_REFERENCE[slug[1]] : undefined;
	let markdown: string;
	if (command) {
		markdown = commandToMarkdown(page.data.title, command);
	} else {
		const raw = await page.data.getText("raw");
		markdown = `# ${page.data.title}\n\n${raw.replace(/^---[\s\S]*?---\s*/, "")}`;
	}

	return new Response(markdown, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
}
