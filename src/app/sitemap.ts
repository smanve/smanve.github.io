import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  routes.push(
    ...getAllProjects().map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: project.date ? new Date(project.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  routes.push(
    ...getAllPosts().map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return routes;
}
