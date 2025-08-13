import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Manvendra Singh",
  description: "Notes on projects, infra, and security.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="mx-4 my-16 md:mx-0 space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="text-gray-600">Fresh thoughts, learnings, and write-ups.</p>

      <ul className="space-y-4">
        {posts.map(p => (
          <li key={p.slug} className="p-4 rounded-lg border hover:shadow">
            <Link href={`/blog/${p.slug}`} className="font-semibold underline">
              {p.title}
            </Link>
            <div className="text-sm opacity-70">
              {p.date ? new Date(p.date).toDateString() : ""}
            </div>
            {p.summary && <p className="opacity-80">{p.summary}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
