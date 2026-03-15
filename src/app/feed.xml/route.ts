import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = [
    ...getAllPosts().map((post) => ({
      title: post.title,
      url: `${siteConfig.url}/blog/${post.slug}`,
      description: post.summary || "New note from the portfolio.",
      date: post.date,
      categories: ["Blog"],
    })),
    ...getAllProjects().map((project) => ({
      title: project.title,
      url: `${siteConfig.url}/projects/${project.slug}`,
      description: project.summary || "New project published on the portfolio.",
      date: project.date,
      categories: ["Project", ...(project.tags ?? [])],
    })),
  ]
    .filter(
      (item): item is typeof item & { date: string } => Boolean(item.date),
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const lastBuildDate =
    items[0]?.date ? new Date(items[0].date).toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-au</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid>${escapeXml(item.url)}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      ${item.categories
        .map((category) => `<category>${escapeXml(category)}</category>`)
        .join("")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
