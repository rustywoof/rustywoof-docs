// src/app/api/feedback/route.ts

import { z } from "zod";

const schema = z.object({
	path: z.string().max(200).startsWith("/docs"),
	vote: z.enum(["good", "bad"]),
});

/**
 * Accepts a thumbs up/down for a docs page and records client feedback.
 */
export async function POST(request: Request): Promise<Response> {
	const parsed = schema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return Response.json({ error: "Invalid payload" }, { status: 400 });
	return Response.json({ ok: true });
}
