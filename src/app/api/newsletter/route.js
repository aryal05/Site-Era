import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Newsletter subscriptions are stored via a third-party service (e.g. Mailchimp).
// For now this endpoint validates the email and returns success so the UI works.
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
