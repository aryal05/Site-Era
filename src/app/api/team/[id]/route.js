import { NextResponse } from "next/server";
import {
  getDb,
  handleApiError,
  mapTeamMember,
  notFound,
  teamPayload,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();

    const { data, error } = await db
      .from("team_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Team member");

    return NextResponse.json(mapTeamMember(data));
  } catch (error) {
    return handleApiError(error, "Failed to fetch team member");
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();
    const body = await request.json();
    const payload = teamPayload(body);

    const { data, error } = await db
      .from("team_members")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return notFound("Team member");

    return NextResponse.json(mapTeamMember(data));
  } catch (error) {
    return handleApiError(error, "Failed to update team member");
  }
}

export async function DELETE(_request, context) {
  try {
    const { id } = await context.params;
    const db = getDb();

    const { error } = await db.from("team_members").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Failed to delete team member");
  }
}
