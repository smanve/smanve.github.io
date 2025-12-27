import fs from "node:fs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllProjects, getProjectFile } from "@/lib/projects";

type FM = {
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[];
  hero?: string;
  repo?: string;
  demo?: string;
};

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const file = getProjectFile(params.slug);
  if (!fs.existsSync(file)) return notFound();

  const source = fs.readFileSync(file, "utf-8");
  const { content, frontmatter } = await compileMDX<FM>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <main className="space-y-6">
      <nav className="text-sm">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-[color:var(--muted)] hover:text-[color:var(--text)]"
        >
          ← Back to Projects
        </Link>
      </nav>

      <h1 className="text-3xl font-bold">{frontmatter.title ?? params.slug}</h1>

      {/* tags */}
      {frontmatter.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((t) => (
            <span key={t} className="ui-badge text-xs">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* hero image */}
      {frontmatter.hero ? (
        <div className="relative h-64 w-full overflow-hidden rounded-lg border border-[color:var(--border)]">
          <Image
            src={frontmatter.hero}
            alt={frontmatter.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      ) : null}

      {/* MDX body (✅ readable in dark mode) */}
      <article className="prose max-w-none prose-a:text-[color:var(--accent)] hover:prose-a:underline">
        {content}
      </article>

      {/* links */}
      <div className="flex gap-4 text-sm">
        {frontmatter.repo && (
          <a className="ui-link" href={frontmatter.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {frontmatter.demo && (
          <a className="ui-link" href={frontmatter.demo} target="_blank" rel="noreferrer">
            Live
          </a>
        )}
      </div>
    </main>
  );
}
