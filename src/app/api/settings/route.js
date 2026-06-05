import { NextResponse } from "next/server";
import { getDb, handleApiError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// The settings table stores rows like { key: 'site_info', value: { name, tagline, ... } }
// We merge them into a flat object that the admin UI expects.

export async function GET() {
  try {
    const db = getDb();

    const { data, error } = await db.from("settings").select("*");
    if (error) throw error;

    const rows = data || [];
    const siteInfo = rows.find((r) => r.key === "site_info")?.value || {};
    const socialRows = rows.find((r) => r.key === "social_links")?.value || {};

    return NextResponse.json({
      siteName: siteInfo.name || "",
      tagline: siteInfo.tagline || "",
      email: siteInfo.email || "",
      phone: siteInfo.phone || "",
      address: siteInfo.address || "",
      description: siteInfo.description || "",
      social: {
        facebook: socialRows.facebook || "",
        twitter: socialRows.twitter || "",
        instagram: socialRows.instagram || "",
        linkedin: socialRows.linkedin || "",
        github: socialRows.github || "",
        youtube: socialRows.youtube || "",
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch settings");
  }
}

export async function PUT(request) {
  try {
    const db = getDb();
    const body = await request.json();

    const siteInfoValue = {
      name: body.siteName || "",
      tagline: body.tagline || "",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
      description: body.description || "",
    };

    const socialValue = {
      facebook: body.social?.facebook || "",
      twitter: body.social?.twitter || "",
      instagram: body.social?.instagram || "",
      linkedin: body.social?.linkedin || "",
      github: body.social?.github || "",
      youtube: body.social?.youtube || "",
    };

    await Promise.all([
      db
        .from("settings")
        .upsert(
          { key: "site_info", value: siteInfoValue },
          { onConflict: "key" },
        ),
      db
        .from("settings")
        .upsert(
          { key: "social_links", value: socialValue },
          { onConflict: "key" },
        ),
    ]);

    return NextResponse.json({
      success: true,
      ...siteInfoValue,
      social: socialValue,
    });
  } catch (error) {
    return handleApiError(error, "Failed to save settings");
  }
}
