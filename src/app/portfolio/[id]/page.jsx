import ProjectDetailPage from "@/components/pages/ProjectDetailPage";
import { getDb, isUuid } from "@/lib/api-helpers";
import { notFound } from "next/navigation";

// force-dynamic: detail pages can have large base64 images stored by the admin.
// ISR would fail with FALLBACK_BODY_TOO_LARGE. Each detail page is one project
// so the Supabase query is fast enough even without caching.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  let title = "Project Details - CodeVerse";
  try {
    const db = getDb();
    // Use isUuid to pick the right column — prevents Supabase UUID parse error
    const query = isUuid(id)
      ? db.from("projects").select("title").eq("id", id)
      : db.from("projects").select("title").eq("slug", id);
    const { data } = await query.maybeSingle();
    if (data?.title) title = `${data.title} - CodeVerse`;
  } catch {}
  return { title, description: "View project details and case study." };
}

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  let project = null;
  try {
    const db = getDb();
    // Correctly route by UUID or slug — never mix types in the same query
    const query = isUuid(id)
      ? db.from("projects").select("*").eq("id", id)
      : db.from("projects").select("*").eq("slug", id);
    const { data } = await query.maybeSingle();
    if (data) {
      project = {
        ...data,
        _id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        fullDescription: data.full_description,
      };
    }
  } catch {}
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
