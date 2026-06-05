import { NextResponse } from "next/server";
import {
  getDb,
  handleApiError,
  mapMessage,
  messagePayload,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    let query = db
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    const readParam = searchParams.get("read");
    if (readParam !== null) query = query.eq("read", readParam === "true");
    if (searchParams.get("limit"))
      query = query.limit(Number(searchParams.get("limit")));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json((data || []).map(mapMessage));
  } catch (error) {
    return handleApiError(error, "Failed to fetch messages");
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const payload = messagePayload(body, { insert: true });

    const { data, error } = await db
      .from("messages")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(mapMessage(data), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to save message");
  }
}
