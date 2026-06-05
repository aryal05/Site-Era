import PortfolioPage from "@/components/pages/PortfolioPage";
import { getDb } from "@/lib/api-helpers";

// Cache for 60 seconds — fast repeat visits, fresh enough data
export const revalidate = 60;

export const metadata = {
  title: "Our Portfolio - CodeVerse",
  description:
    "Explore our portfolio of successful web and mobile app projects.",
};

export default async function Portfolio() {
  let projects = [];
  try {
    const db = getDb();
    const { data } = await db
      .from("projects")
      .select(
        'id, title, slug, description, category, image, technologies, client, created_at, featured, status, "order"',
      )
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    projects = (data || []).map((row) => ({
      ...row,
      _id: row.id,
      createdAt: row.created_at,
    }));
  } catch {
    projects = [];
  }
  return <PortfolioPage projects={projects} />;
}
