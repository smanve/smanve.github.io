import fs from "node:fs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { formatDate } from "@/lib/formatDate";
import { estimateReadingTime, extractHeadings } from "@/lib/contentMeta";
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
  const headings = extractHeadings(source);
  const readingTime = estimateReadingTime(source);
  const relatedProjects = getAllProjects()
    .filter((project) => project.slug !== params.slug)
    .slice(0, 2);

  const { content, frontmatter } = await compileMDX<FM>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <section className="space-y-6">
      <header className="ui-panel-strong px-6 py-8 sm:p-8 lg:p-10">
        <Link href="/projects" className="ui-back-link">
          <span aria-hidden="true">&lt;-</span>
          <span>Back to work</span>
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="ui-chip ui-chip--accent">Case study</span>
          {frontmatter.date ? (
            <span className="ui-chip">{formatDate(frontmatter.date)}</span>
          ) : null}
          <span className="ui-chip">{readingTime} min read</span>
        </div>

        {frontmatter.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="ui-badge">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <h1 className="ui-page-title max-w-4xl">
            {frontmatter.title ?? params.slug}
          </h1>
          {frontmatter.summary ? (
            <p className="ui-lead max-w-3xl">{frontmatter.summary}</p>
          ) : null}
        </div>

        {(frontmatter.repo || frontmatter.demo) && (
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
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
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          {frontmatter.hero ? (
            <div className="ui-panel overflow-hidden">
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={frontmatter.hero}
                  alt={frontmatter.title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="ui-panel p-6 sm:p-8 lg:p-10">
            <article className="prose max-w-none prose-a:text-[color:var(--accent)]">
              {content}
            </article>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="ui-panel p-5">
            <p className="ui-kicker">Quick view</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="ui-meta">Published</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                  {frontmatter.date ? formatDate(frontmatter.date) : "No date"}
                </p>
              </div>

              <div>
                <p className="ui-meta">Read time</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                  {readingTime} min
                </p>
              </div>

              <div>
                <p className="ui-meta">Project type</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                  Experiment with write-up
                </p>
              </div>
            </div>
          </section>

          {headings.length > 0 ? (
            <section className="ui-panel p-5">
              <p className="ui-kicker">Contents</p>
              <nav className="mt-4 space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.slug}
                    href={`#${heading.slug}`}
                    className={[
                      "ui-toc-link",
                      heading.level === 3 ? "pl-4" : "",
                    ].join(" ")}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </section>
          ) : null}

          {relatedProjects.length > 0 ? (
            <section className="ui-panel p-5">
              <p className="ui-kicker">More work</p>
              <div className="mt-4 space-y-3">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="ui-toc-link"
                  >
                    <span className="block text-sm font-semibold text-[color:var(--text)]">
                      {project.title}
                    </span>
                    {project.summary ? (
                      <span className="ui-meta mt-1 block">{project.summary}</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
