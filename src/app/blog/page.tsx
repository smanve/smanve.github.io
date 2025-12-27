import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog - @smanve",
  description: "Notes on projects, infra, and security.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="text-[color:var(--muted)]">
        Fresh thoughts, learnings, and musings.
      </p>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="ui-card p-4 transition-colors">
            <Link href={`/blog/${p.slug}`} className="ui-link font-semibold">
              {p.title}
            </Link>

            <div className="mt-1 text-sm text-[color:var(--muted)]">
              {p.date ? new Date(p.date).toDateString() : ""}
            </div>

            {p.summary && (
              <p className="mt-2 text-[color:var(--muted)]">{p.summary}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
