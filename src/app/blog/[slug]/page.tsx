import fs from "node:fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { formatDate } from "@/lib/formatDate";
import { estimateReadingTime, extractHeadings } from "@/lib/contentMeta";
import { getAllPosts, getPostFile } from "@/lib/posts";

type Frontmatter = {
  title?: string;
  date?: string;
  summary?: string;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = getPostFile(params.slug);
  if (!fs.existsSync(filePath)) return notFound();

  const source = fs.readFileSync(filePath, "utf-8");
  const headings = extractHeadings(source);
  const readingTime = estimateReadingTime(source);
  const otherPosts = getAllPosts()
    .filter((post) => post.slug !== params.slug)
    .slice(0, 3);

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <section className="space-y-6">
      <header className="ui-panel-strong px-6 py-8 sm:p-8 lg:p-10">
        <Link href="/blog" className="ui-back-link">
          <span aria-hidden="true">&lt;-</span>
          <span>Back to notes</span>
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="ui-chip ui-chip--accent">Note</span>
          {frontmatter.date ? (
            <span className="ui-chip">{formatDate(frontmatter.date)}</span>
          ) : null}
          <span className="ui-chip">{readingTime} min read</span>
        </div>

        <div className="mt-5 space-y-4">
          <h1 className="ui-page-title max-w-4xl">
            {frontmatter.title ?? params.slug}
          </h1>
          {frontmatter.summary ? (
            <p className="ui-lead max-w-3xl">{frontmatter.summary}</p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="ui-panel p-6 sm:p-8 lg:p-10">
          <article className="prose max-w-none prose-a:text-[color:var(--accent)]">
            {content}
          </article>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="ui-panel p-5">
            <p className="ui-kicker">Note details</p>
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
                <p className="ui-meta">Intent</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                  Turn live work into reusable learning
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

          {otherPosts.length > 0 ? (
            <section className="ui-panel p-5">
              <p className="ui-kicker">More notes</p>
              <div className="mt-4 space-y-3">
                {otherPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="ui-toc-link"
                  >
                    <span className="block text-sm font-semibold text-[color:var(--text)]">
                      {post.title}
                    </span>
                    <span className="ui-meta mt-1 block">
                      {post.date ? formatDate(post.date) : "Undated"}
                      {" / "}
                      {post.readingTime} min read
                    </span>
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
