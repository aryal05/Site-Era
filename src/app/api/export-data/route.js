import { NextResponse } from "next/server";
import { getDb, handleApiError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    const [projects, services, blogs, testimonials, teamMembers] =
      await Promise.all([
        db
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        db.from("services").select("*").order("order", { ascending: true }),
        db.from("blog").select("*").order("created_at", { ascending: false }),
        db.from("testimonials").select("*").order("order", { ascending: true }),
        db.from("team_members").select("*").order("order", { ascending: true }),
      ]);

    const exportData = {
      projects: projects.data || [],
      services: services.data || [],
      blogs: blogs.data || [],
      testimonials: testimonials.data || [],
      teamMembers: teamMembers.data || [],
      exportedAt: new Date().toISOString(),
      totalRecords: {
        projects: projects.data?.length || 0,
        services: services.data?.length || 0,
        blogs: blogs.data?.length || 0,
        testimonials: testimonials.data?.length || 0,
        teamMembers: teamMembers.data?.length || 0,
      },
    };

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition":
          'attachment; filename="codeverse-data-export.json"',
      },
    });
  } catch (error) {
    return handleApiError(error, "Export failed");
  }
}
