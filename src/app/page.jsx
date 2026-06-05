import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import { getDb } from "@/lib/api-helpers";

export const revalidate = 300;

async function getFeaturedProjects() {
  try {
    const db = getDb();

    const { data, error } = await db
      .from("projects")
      .select("id,title,slug,image,category,client,description,created_at")
      .eq("featured", true)
      .order("order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Failed to fetch featured projects:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      image: row.image,
      category: row.category,
      client: row.client,
      description: row.description,
      createdAt: row.created_at,
      technologies: [],
    }));
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Portfolio projects={featuredProjects} />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}
