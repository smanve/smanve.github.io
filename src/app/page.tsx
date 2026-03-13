import Link from "next/link";
import MailButton from "./components/MailButton";
import Projects from "./components/projects";
import { getAllPosts } from "@/lib/posts";

const LINKS = [
  {
    href: "https://github.com/smanve",
    label: "GitHub",
    detail: "If you want the raw code, start here.",
  },
  {
    href: "https://rxresu.me/manvendrasingh1999/continuous-genuine-barracuda",
    label: "Resume",
    detail: "Need the short version? This is it.",
  },
  {
    href: "https://www.linkedin.com/in/manvendrasingh1999/",
    label: "LinkedIn",
    detail: "The more polished version of my work history.",
  },
];

export default function Page() {
  const latestPost = getAllPosts()[0];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)]">
        <div className="ui-panel-strong px-6 py-8 sm:p-10">
          <p className="ui-kicker">Software engineer in Melbourne, Australia</p>
          <h1 className="ui-display-title mt-6 max-w-3xl">
            I build web apps, test ideas, and write about what I learn when
            things get messy.
          </h1>
          <p className="ui-lead mt-5 max-w-2xl">
            You will mostly find frontend work here, with a few security and
            infrastructure labs mixed in.
          </p>
          <p className="ui-lead mt-4 max-w-2xl">
            I like taking vague ideas, rough edges, and awkward flows, then
            turning them into something people can actually use. Curious how I
            think? Start with the projects.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="ui-button">
              View projects
            </Link>
            <Link href="/blog" className="ui-button-secondary">
              Read notes
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <section className="ui-panel p-6">
            <p className="ui-kicker">Current focus</p>
            <ul className="ui-body mt-5 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                End-to-end product development, from ideation to launch and iteration.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                Getting better at cloud and security work by building small labs
                and breaking them on purpose.
              </li>
            </ul>
          </section>

          <section className="ui-panel p-6">
            <p className="ui-kicker">Latest note</p>
            {latestPost ? (
              <div className="mt-4 space-y-3">
                <h2 className="ui-card-title">{latestPost.title}</h2>
                {latestPost.summary ? (
                  <p className="ui-body">{latestPost.summary}</p>
                ) : null}
                <Link href={`/blog/${latestPost.slug}`} className="ui-link">
                  Read the post
                </Link>
              </div>
            ) : (
              <p className="ui-body mt-4">
                More writing is on the way.
              </p>
            )}
          </section>
        </div>
      </section>

      <Projects />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="ui-panel p-6 sm:p-7">
          <p className="ui-kicker">Around the web</p>
          <div className="mt-6 space-y-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4 hover:border-[color:var(--border-strong)]"
              >
                <div>
                  <div className="ui-inline-title">{link.label}</div>
                  <div className="ui-body mt-1">{link.detail}</div>
                </div>
                <span className="ui-meta">Open</span>
              </a>
            ))}
          </div>
        </div>

        <section className="ui-panel p-6 sm:p-7">
          <p className="ui-kicker">Contact</p>
          <div className="mt-6 space-y-4">
            <h2 className="ui-section-title max-w-lg">
              Have a role, project, or just a question?
            </h2>
            <p className="ui-body">
              Email is still the best way to reach me.
              If LinkedIn is easier for you, that works too.
            </p>
            <div className="flex flex-wrap gap-3">
              <MailButton />
              <a
                href="https://www.linkedin.com/in/manvendrasingh1999/"
                target="_blank"
                rel="noopener noreferrer"
                className="ui-button-secondary"
              >
                LinkedIn
              </a>
            </div>
            <p className="ui-meta">
              Short message is fine. You do not need to overthink it.
            </p>
          </div>
        </section>
      </section>

      <footer className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="font-sfmono text-xs uppercase tracking-[0.18em]">
          @smanve
        </div>
        <div>{new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
