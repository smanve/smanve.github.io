import fs from "node:fs";
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

// Build each post at compile time
export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const filePath = getPostFile(params.slug);
  if (!fs.existsSync(filePath)) return notFound();

  const source = fs.readFileSync(filePath, "utf-8");

  // compileMDX turns the MDX string into a renderable React node (RSC-safe)
  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true, // reads the --- frontmatter ---
      mdxOptions: {
        remarkPlugins: [remarkGfm], // tables, strikethrough, etc.
        rehypePlugins: [rehypeSlug], // adds ids to headings
      },
    },
    components: {
      // You can expose custom components to MDX here, e.g.:
      // Code: (props: any) => <pre className="bg-zinc-900 text-white p-4 rounded" {...props} />
    },
  });

  return (
    <main className="mx-4 my-16 md:mx-0 space-y-6">
      <h1 className="text-3xl font-bold">{frontmatter.title ?? params.slug}</h1>
      {frontmatter.date && (
        <div className="opacity-60">{new Date(frontmatter.date).toDateString()}</div>
      )}

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        {content}
      </article>
    </main>
  );
}
