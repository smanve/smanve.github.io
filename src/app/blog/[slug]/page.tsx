import fs from "node:fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostFile } from "@/lib/posts";

type Frontmatter = {
  title?: string;
  date?: string;
  summary?: string;
};

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
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
    <main className="space-y-6">
      <nav className="text-sm">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[color:var(--muted)] hover:text-[color:var(--text)]"
        >
          ← Back to Blog
        </Link>
      </nav>

      <h1 className="text-3xl font-bold">{frontmatter.title ?? params.slug}</h1>

      {frontmatter.date && (
        <div className="text-sm text-[color:var(--muted)]">
          {new Date(frontmatter.date).toDateString()}
        </div>
      )}

      <article className="prose max-w-none prose-a:text-[color:var(--accent)] hover:prose-a:underline">
        {content}
      </article>
    </main>
  );
}
