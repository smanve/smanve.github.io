import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export const revalidate = 3600;

export async function GET() {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const uniqueTags = new Set(
    projects.flatMap((project) => project.tags?.filter(Boolean) ?? []),
  );
  const updatedAt = [...posts, ...projects]
    .map((item) => item.date)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => (a < b ? 1 : -1))[0] ?? null;

  return NextResponse.json({
    endpoint: "/api/site-signal",
    generatedAt: new Date().toISOString(),
    updatedAt,
    projectCount: projects.length,
    postCount: posts.length,
    tagCount: uniqueTags.size,
    latestProject: projects[0]
      ? {
          slug: projects[0].slug,
          title: projects[0].title,
          date: projects[0].date,
          readingTime: projects[0].readingTime,
        }
      : null,
    latestPost: posts[0]
      ? {
          slug: posts[0].slug,
          title: posts[0].title,
          date: posts[0].date,
          readingTime: posts[0].readingTime,
        }
      : null,
  });
}
