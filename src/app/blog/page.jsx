import BlogPage from "@/components/pages/BlogPage";
import { getDb } from "@/lib/api-helpers";

export const revalidate = 300;

export const metadata = {
  title: "Blog - CodeVerse",
  description:
    "Read our latest insights on web development, mobile apps, and digital trends.",
};

async function getBlogPosts() {
  try {
    const db = getDb();

    const { data, error } = await db
      .from("blog")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        image,
        author,
        category,
        tags,
        read_time,
        published,
        featured,
        created_at
      `,
      )
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((post) => ({
      _id: post.id,
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      image: post.image || "",
      author: post.author || { name: "Admin" },
      category: post.category || "General",
      tags: Array.isArray(post.tags) ? post.tags : [],
      readTime: post.read_time || "5 min read",
      featured: !!post.featured,
      createdAt: post.created_at,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getBlogPosts();
  return <BlogPage initialPosts={posts} />;
}
