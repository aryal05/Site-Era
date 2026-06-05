import { NextResponse } from "next/server";
import { getDb, handleApiError } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const db = getDb();

    const { data: user, error } = await db
      .from("users")
      .select("id, username, password_hash, role, active")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;

    if (!user || !user.active) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn: "7d" },
    );

    // Update last_login timestamp (best-effort, don't fail login if this errors)
    db.from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id)
      .then(() => {});

    return NextResponse.json({
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
}
