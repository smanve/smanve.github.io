import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  hero?: string;
  repo?: string;
  demo?: string;
};

const PROJ_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): ProjectMeta[] {
  const files = fs.readdirSync(PROJ_DIR).filter(f => f.endsWith(".mdx"));
  const list = files.map(file => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PROJ_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      hero: data.hero ?? "",
      repo: data.repo ?? "",
      demo: data.demo ?? "",
    } as ProjectMeta;
  });
  // newest first if date is set
  return list.sort((a, b) => (a.date ?? "") < (b.date ?? "") ? 1 : -1);
}

export function getProjectFile(slug: string) {
  return path.join(PROJ_DIR, `${slug}.mdx`);
}
