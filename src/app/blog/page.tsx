import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog - @smanve",
  description: "Notes from work, side projects, and lessons worth keeping.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="ui-kicker">Blog</p>
        <h1 className="ui-page-title max-w-3xl">
          Notes from work, side projects, and the moments where something
          finally clicked.
        </h1>
        <p className="ui-lead max-w-2xl">
          I write when I hit a useful lesson. Sometimes it is technical.
          Sometimes it is just about working better with people.
        </p>
      </div>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="ui-panel p-6">
            <div className="space-y-3">
              <div className="ui-meta">
                {post.date ? formatDate(post.date) : ""}
              </div>
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="ui-card-title">{post.title}</h2>
              </Link>
              {post.summary ? <p className="ui-body">{post.summary}</p> : null}
              <Link href={`/blog/${post.slug}`} className="ui-link">
                Read article
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
