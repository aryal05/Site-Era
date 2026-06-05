import { NextResponse } from "next/server";
import {
  getDb,
  handleApiError,
  mapService,
  servicePayload,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    let query = db
      .from("services")
      .select("*")
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (searchParams.get("all") !== "true") query = query.eq("active", true);
    if (searchParams.get("featured") === "true")
      query = query.eq("featured", true);
    if (searchParams.get("limit"))
      query = query.limit(Number(searchParams.get("limit")));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json((data || []).map(mapService));
  } catch (error) {
    return handleApiError(error, "Failed to fetch services");
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();
    const payload = servicePayload(body, { insert: true });

    const { data, error } = await db
      .from("services")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(mapService(data), { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create service");
  }
}
