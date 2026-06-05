import { NextResponse } from "next/server";
import {
  blogPayload,
  byIdOrSlug,
  getDb,
  handleApiError,
  mapBlog,
  notFound,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  try {
    const { slug } = await context.params;
    const db = getDb();

    const { data, error } = await byIdOrSlug(
      db.from("blog").select("*"),
      slug,
    ).maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Blog post");

    return NextResponse.json(mapBlog(data));
  } catch (error) {
    return handleApiError(error, "Failed to fetch blog post");
  }
}

export async function PUT(request, context) {
  try {
    const { slug } = await context.params;
    const db = getDb();
    const body = await request.json();
    const payload = blogPayload(body);

    const { data, error } = await byIdOrSlug(
      db.from("blog").update(payload).select("*"),
      slug,
    ).maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Blog post");

    return NextResponse.json(mapBlog(data));
  } catch (error) {
    return handleApiError(error, "Failed to update blog post");
  }
}

export async function DELETE(_request, context) {
  try {
    const { slug } = await context.params;
    const db = getDb();

    const { error } = await byIdOrSlug(db.from("blog").delete(), slug);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete blog post");
  }
}
