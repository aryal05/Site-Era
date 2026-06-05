import { NextResponse } from "next/server";
import {
  compact,
  getDb,
  handleApiError,
  mapMessage,
  notFound,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();

    const { data, error } = await db
      .from("messages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Message");

    return NextResponse.json(mapMessage(data));
  } catch (error) {
    return handleApiError(error, "Failed to fetch message");
  }
}

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();
    const body = await request.json();

    const payload = compact({
      read: body.read,
      archived: body.archived,
    });

    const { data, error } = await db
      .from("messages")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Message");

    return NextResponse.json(mapMessage(data));
  } catch (error) {
    return handleApiError(error, "Failed to update message");
  }
}

export async function DELETE(_request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();

    const { error } = await db.from("messages").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete message");
  }
}
