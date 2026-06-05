import { NextResponse } from "next/server";
import { blogPayload, getDb, handleApiError, mapBlog } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    let query = db
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (searchParams.get("published") === "true")
      query = query.eq("published", true);
    if (searchParams.get("featured") === "true")
      query = query.eq("featured", true);
    if (searchParams.get("category"))
      query = query.eq("category", searchParams.get("category"));
    if (searchParams.get("limit"))
      query = query.limit(Number(searchParams.get("limit")));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json((data || []).map(mapBlog));
  } catch (error) {
    return handleApiError(error, "Failed to fetch blog posts");
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
