import { NextResponse } from "next/server";
import {
  blogPayload,
  byIdOrSlug,
  getDb,
  handleApiError,
  mapBlog,
  notFound,
  safeImageUrl,
} from "@/lib/api-helpers";

export const revalidate = 300;

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
  created_at,
  updated_at,
  meta_title,
  meta_description
`;

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
  created_at,
  updated_at
`;

// List all blog posts (for admin dashboard)
export async function GET(request) {
  try {
    const db = getDb();
    
    // List all posts
    const { data, error } = await db
      .from("blog")
      .select(BLOG_LIST_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const posts = (data || []).map((post) => ({
      ...mapBlog(post),
      image: safeImageUrl(post.image),
    }));

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch blog posts");
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
