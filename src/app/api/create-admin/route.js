import { NextResponse } from "next/server";
import { getDb, handleApiError } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json().catch(() => ({}));
    const password = body.password || "admin123";

    // Check if admin already exists
    const { data: existing } = await db
      .from("users")
      .select("id, username")
      .eq("username", "admin")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        status: "info",
        message:
          "Admin user already exists. Login at /admin with username: admin",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await db
      .from("users")
      .insert({
        username: "admin",
        email: "admin@codeverse.com",
        password_hash,
        role: "admin",
        active: true,
      })
      .select("id, username, role")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        status: "success",
        message: "Admin user created successfully",
        credentials: { username: "admin", password },
        instruction: "Login at /admin",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "Failed to create admin user");
  }
}
