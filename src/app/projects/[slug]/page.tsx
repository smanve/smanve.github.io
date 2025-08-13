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

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
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
    <main className="mx-4 my-16 md:mx-0 space-y-6">
      <nav className="text-sm">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 underline text-primary/70 hover:text-primary"
        >
          ← Back to Projects
        </Link>
      </nav>

      <h1 className="text-3xl font-bold">{frontmatter.title ?? params.slug}</h1>

      {/* tags */}
      {frontmatter.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* hero image */}
      {frontmatter.hero ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image src={frontmatter.hero} alt={frontmatter.title ?? ""} fill className="object-cover" />
        </div>
      ) : null}

      {/* Render the MDX body */}
      <article className="prose prose-slate max-w-none prose-headings:text-zinc-900 prose-p:text-zinc-800 prose-li:text-zinc-800 prose-strong:text-zinc-900 prose-a:text-primary hover:prose-a:underline">
        {content}
      </article>

      {/* links */}
      <div className="flex gap-4">
        {frontmatter.repo && (
          <a className="underline" href={frontmatter.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {frontmatter.demo && (
          <a className="underline" href={frontmatter.demo} target="_blank" rel="noreferrer">
            Live
          </a>
        )}
      </div>
    </main>
  );
}
