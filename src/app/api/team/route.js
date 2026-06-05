import { NextResponse } from "next/server";
import {
  getDb,
  handleApiError,
  mapTeamMember,
  teamPayload,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    let query = db
      .from("team_members")
      .select("*")
      .eq("active", true)
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (searchParams.get("limit"))
      query = query.limit(Number(searchParams.get("limit")));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json((data || []).map(mapTeamMember));
  } catch (error) {
    return handleApiError(error, "Failed to fetch team members");
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const payload = teamPayload(body, { insert: true });

    const { data, error } = await db
      .from("team_members")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(mapTeamMember(data), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create team member");
  }
}
