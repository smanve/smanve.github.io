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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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
    <main className="mx-4 my-16 md:mx-0 space-y-6">
      <nav className="text-sm">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 underline text-primary/70 hover:text-primary"
        >
          ← Back to Blog
        </Link>
      </nav>

      <h1 className="text-3xl font-bold">{frontmatter.title ?? params.slug}</h1>
      {frontmatter.date && (
        <div className="opacity-60">{new Date(frontmatter.date).toDateString()}</div>
      )}

      {/* Render the MDX body */}
      <article className="prose prose-slate max-w-none prose-headings:text-zinc-900 prose-p:text-zinc-800 prose-li:text-zinc-800 prose-strong:text-zinc-900 prose-a:text-primary hover:prose-a:underline">
        {content}
      </article>
    </main>
  );
}
