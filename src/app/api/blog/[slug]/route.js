import { NextResponse } from "next/server";
import {
  byIdOrSlug,
  blogPayload,
  getDb,
  handleApiError,
  mapBlog,
  notFound,
} from "@/lib/api-helpers";

export const revalidate = 300;

const BLOG_LIST_COLUMNS = `
  id,
  title,
  slug,
  excerpt,
  image,
  author,
  category,
  tags,
  read_time,
  published,
  featured,
  created_at
`;

const BLOG_DETAIL_COLUMNS = `
  id,
  title,
  slug,
  excerpt,
  content,
  image,
  author,
  category,
  tags,
  read_time,
  published,
  featured,
  meta_title,
  meta_description,
  created_at,
  updated_at
`;

export async function GET(request, context) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const db = getDb();

    const { data, error } = await byIdOrSlug(
      db.from("blog").select(BLOG_DETAIL_COLUMNS),
      slug,
    ).maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Blog post");

    return NextResponse.json(mapBlog(data), {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch blog post");
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const payload = blogPayload(body, { insert: true });

    const { data, error } = await db
      .from("blog")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(mapBlog(data), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create blog post");
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const slug = params.slug;
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
    const params = await context.params;
    const slug = params.slug;
    const db = getDb();

    const { error } = await byIdOrSlug(db.from("blog").delete(), slug);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete blog post");
  }
}
