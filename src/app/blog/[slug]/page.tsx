import fs from "node:fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { formatDate } from "@/lib/formatDate";
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
  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm">
        <Link href="/blog" className="ui-back-link">
          <span aria-hidden="true">&lt;-</span>
          <span>Back to blog</span>
        </Link>
      </nav>

      <header className="ui-panel-strong p-6 sm:p-8">
        <div className="space-y-3">
          {frontmatter.date ? (
            <div className="ui-meta">{formatDate(frontmatter.date)}</div>
          ) : null}
          <h1 className="ui-page-title">
            {frontmatter.title ?? params.slug}
          </h1>
          {frontmatter.summary ? (
            <p className="ui-lead">{frontmatter.summary}</p>
          ) : null}
        </div>
      </header>

      <div className="ui-panel p-6 sm:p-8">
        <article className="prose max-w-none prose-a:text-[color:var(--accent)]">
          {content}
        </article>
      </div>
    </section>
  );
}
