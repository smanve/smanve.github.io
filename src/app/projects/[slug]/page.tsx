import fs from "node:fs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { formatDate } from "@/lib/formatDate";
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
  return getAllProjects().map((project) => ({ slug: project.slug }));
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
    <section className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm">
        <Link href="/projects" className="ui-back-link">
          <span aria-hidden="true">&lt;-</span>
          <span>Back to projects</span>
        </Link>
      </nav>

      <header className="ui-panel-strong p-6 sm:p-8">
        <div className="space-y-5">
          {frontmatter.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="ui-badge">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="space-y-3">
            <h1 className="ui-page-title">
              {frontmatter.title ?? params.slug}
            </h1>
            {frontmatter.summary ? (
              <p className="ui-lead">{frontmatter.summary}</p>
            ) : null}
            {frontmatter.date ? (
              <div className="ui-meta">{formatDate(frontmatter.date)}</div>
            ) : null}
          </div>

          {(frontmatter.repo || frontmatter.demo) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {frontmatter.repo && (
                <a
                  className="ui-button-secondary"
                  href={frontmatter.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
              {frontmatter.demo && (
                <a
                  className="ui-button"
                  href={frontmatter.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live project
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {frontmatter.hero ? (
        <div className="ui-panel overflow-hidden">
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src={frontmatter.hero}
              alt={frontmatter.title ?? ""}
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="ui-panel p-6 sm:p-8">
        <article className="prose max-w-none prose-a:text-[color:var(--accent)]">
          {content}
        </article>
      </div>
    </section>
  );
}
