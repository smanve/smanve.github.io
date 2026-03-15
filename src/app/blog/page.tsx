import Link from "next/link";
import SiteSignal from "../components/SiteSignal";
import { formatDate } from "@/lib/formatDate";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog - @smanve",
  description: "Technical notes, project lessons, and working notes by @smanve.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)]">
        <div className="ui-panel-strong px-6 py-8 sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="ui-chip ui-chip--accent">Notes</span>
            <span className="ui-chip">Technical writing</span>
            <span className="ui-chip">Lessons learned</span>
          </div>

          <p className="ui-kicker mt-8">Blog</p>
          <h1 className="ui-page-title mt-4 max-w-4xl">
            Notes from projects, team work, and the moments where something
            finally clicked.
          </h1>
          <p className="ui-lead mt-5 max-w-2xl">
            I write to make the learning stick. Sometimes that means a technical
            walkthrough. Sometimes it means a note about product work, feedback,
            or the habits that make engineering easier to trust.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/feed.xml" className="ui-button-secondary">
              Subscribe via RSS
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="ui-proof-card">
              <p className="ui-meta">Published notes</p>
              <div className="ui-stat-value mt-2">{posts.length}</div>
            </article>
            <article className="ui-proof-card">
              <p className="ui-meta">Writing style</p>
              <div className="mt-2 text-base font-semibold text-[color:var(--text)]">
                Practical and reflective
              </div>
            </article>
            <article className="ui-proof-card">
              <p className="ui-meta">Goal</p>
              <div className="mt-2 text-base font-semibold text-[color:var(--text)]">
                Make useful things legible
              </div>
            </article>
          </div>
        </div>

        <SiteSignal />
      </section>

      {featured ? (
        <section className="ui-panel p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="ui-chip ui-chip--accent">Latest note</span>
            {featured.date ? (
              <span className="ui-chip">{formatDate(featured.date)}</span>
            ) : null}
            <span className="ui-chip">{featured.readingTime} min read</span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)]">
            <div className="space-y-4">
              <h2 className="ui-section-title max-w-3xl">{featured.title}</h2>
              {featured.summary ? (
                <p className="ui-body max-w-2xl">{featured.summary}</p>
              ) : null}
              <Link href={`/blog/${featured.slug}`} className="ui-button-secondary">
                Read the article
              </Link>
            </div>

            <div className="ui-signal-card">
              <p className="ui-kicker">Why this exists</p>
              <p className="ui-body mt-4">
                Writing is where I turn work into reusable judgment. It is part
                notes archive, part personal documentation, part way of thinking
                in public without pretending everything was obvious from the
                start.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="ui-kicker">Archive</p>
          <h2 className="ui-section-title mt-3 max-w-3xl">
            The full list of notes so far.
          </h2>
        </div>

        <ul className="grid gap-4 lg:grid-cols-2">
          {(rest.length > 0 ? rest : featured ? [featured] : []).map((post) => (
            <li key={post.slug} className="ui-panel p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {post.date ? (
                    <span className="ui-chip">{formatDate(post.date)}</span>
                  ) : null}
                  <span className="ui-chip">{post.readingTime} min read</span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="ui-card-title">{post.title}</h3>
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
    </div>
  );
}
