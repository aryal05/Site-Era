import { NextResponse } from "next/server";
import { getDb, handleApiError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    const { data: user, error } = await db
      .from("users")
      .select("id, username, role, created_at")
      .eq("username", "admin")
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({
        status: "warning",
        message:
          "No admin user found in Supabase. Run the supabase-schema.sql and supabase-seed.sql scripts.",
        connected: true,
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Database connected and admin user exists",
      user: {
        username: user.username,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    return handleApiError(error, "Database check failed");
  }
}
