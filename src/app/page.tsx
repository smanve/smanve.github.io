import Link from "next/link";
import ContactForm from "./components/ContactForm";
import MailButton from "./components/MailButton";
import Projects from "./components/projects";
import SiteSignal from "./components/SiteSignal";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { formatDate } from "@/lib/formatDate";
import { siteConfig } from "@/lib/site";

const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind",
  "Node",
  "APIs",
  "Auth",
  "MDX",
];

const PROOF_CARDS = [
  {
    label: "Frontend",
    title: "Calm interfaces for messy flows",
    detail:
      "I like turning dense states, awkward workflows, and unclear UX into something people can trust.",
  },
  {
    label: "Backend",
    title: "Enough depth to shape the product well",
    detail:
      "I care about APIs, validation, auth boundaries, and data structures because they decide how clean the UI can be.",
  },
  {
    label: "Systems",
    title: "Labs that sharpen engineering judgment",
    detail:
      "Cloud, security, and infrastructure experiments help me understand what breaks once software leaves the happy path.",
  },
];

const CAPABILITIES = [
  {
    label: "Frontend systems",
    title: "Interfaces that stay readable under pressure.",
    points: [
      "Design systems and reusable UI patterns",
      "Data-heavy views, progressive disclosure, and careful empty states",
      "Performance-aware rendering and interaction design",
    ],
  },
  {
    label: "Backend surfaces",
    title: "The server-side work that makes UI feel better.",
    points: [
      "API shaping for real screens and product flows",
      "Forms, validation, auth, and sensible failure states",
      "Server rendering, content pipelines, and boring reliability",
    ],
  },
  {
    label: "Labs and learning",
    title: "Hands-on systems work that turns into case studies.",
    points: [
      "Cloud and security experiments",
      "Infrastructure notes and setup guides",
      "Explaining what broke, why, and how I fixed it",
    ],
  },
];

const PRACTICES = [
  {
    title: "Clarity over cleverness",
    detail:
      "I want products to feel obvious once you use them, even if the implementation took real effort behind the scenes.",
  },
  {
    title: "Safe iteration",
    detail:
      "Small, reviewable changes with clear states and clean rollback paths beat dramatic rewrites every time.",
  },
  {
    title: "Product-minded engineering",
    detail:
      "Performance, data shape, loading strategy, and edge cases are all product decisions, not just technical details.",
  },
];

const LINKS = [
  {
    href: siteConfig.social.github,
    label: "GitHub",
    detail: "Raw code, experiments, and the work behind the polished version.",
  },
  {
    href: siteConfig.social.resume,
    label: "Resume",
    detail: "A shorter pass through my experience and what I have shipped.",
  },
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    detail: "Career context, work history, and the more formal version of me.",
  },
  {
    href: "/feed.xml",
    label: "RSS Feed",
    detail: "Subscribe to new notes and project write-ups as they get published.",
  },
];

export default function Page() {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const latestPost = posts[0];
  const featuredProject = projects[0];

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <section className="ui-panel-strong ui-fade-up relative overflow-hidden px-6 py-8 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent-soft),transparent_18%),transparent_45%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--accent-soft),transparent_28%),transparent_40%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.92fr)]">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="ui-chip ui-chip--accent">Manvendra Singh</span>
              <span className="ui-chip">Frontend engineer</span>
              <span className="ui-chip">Backend aware</span>
            </div>

            <p className="ui-kicker mt-8">
              Melbourne, Australia / building calm software for messy problems
            </p>

            <h1 className="ui-display-title mt-5 max-w-4xl">
              I design interfaces people can trust and build the systems
              underneath them well enough to hold up.
            </h1>

            <p className="ui-lead mt-6 max-w-2xl">
              Most of my work starts at the product edge: dense UI, awkward
              workflows, unclear data, and the hidden complexity that appears
              after launch. I like turning that into something clear, fast, and
              sturdy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="ui-button">
                Explore work
              </Link>
              <Link href="/blog" className="ui-button-secondary">
                Read notes
              </Link>
              <MailButton label="Start a conversation" />
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {PROOF_CARDS.map((card) => (
                <article key={card.label} className="ui-proof-card">
                  <p className="ui-kicker">{card.label}</p>
                  <h2 className="ui-inline-title mt-4">{card.title}</h2>
                  <p className="ui-body mt-3">{card.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <section className="ui-terminal">
              <div className="ui-terminal__bar">
                <div className="ui-terminal__dots" aria-hidden="true">
                  <span className="ui-terminal__dot" />
                  <span className="ui-terminal__dot" />
                  <span className="ui-terminal__dot" />
                </div>
                <span className="ui-terminal__title">
                  manvendra://capability-board
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="ui-console-line">
                    <span className="ui-console-prompt">$</span>
                    <span>profile --summary</span>
                  </div>
                  <p className="ui-body mt-3">
                    Frontend engineer with a product lens, enough backend depth
                    to shape better experiences, and a habit of turning labs
                    into learning.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="ui-signal-card">
                    <p className="ui-meta">Featured case study</p>
                    <p className="mt-2 text-base font-semibold text-[color:var(--text)]">
                      {featuredProject ? featuredProject.title : "In progress"}
                    </p>
                    <p className="ui-meta mt-2">
                      {projects.length} project{projects.length === 1 ? "" : "s"}{" "}
                      currently published
                    </p>
                  </div>

                  <div className="ui-signal-card">
                    <p className="ui-meta">Latest note</p>
                    <p className="mt-2 text-base font-semibold text-[color:var(--text)]">
                      {latestPost ? latestPost.title : "Writing in progress"}
                    </p>
                    <p className="ui-meta mt-2">
                      Shipping lessons, technical notes, and the useful messy
                      bits
                    </p>
                  </div>
                </div>

                <div>
                  <div className="ui-console-line">
                    <span className="ui-console-prompt">$</span>
                    <span>stack --core</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {STACK.map((item) => (
                      <span key={item} className="ui-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <SiteSignal />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
        <div className="ui-panel p-6 sm:p-7">
          <p className="ui-kicker">What I can own</p>
          <h2 className="ui-section-title mt-4 max-w-2xl">
            Frontend polish matters more when the data contracts, loading
            states, and failure paths are solid too.
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <article key={item.label} className="ui-signal-card h-full">
                <p className="ui-kicker">{item.label}</p>
                <h3 className="ui-inline-title mt-4">{item.title}</h3>
                <ul className="mt-4 space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 ui-body">
                      <span className="ui-list-marker" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <aside className="ui-panel p-6 sm:p-7">
          <p className="ui-kicker">How I build</p>
          <div className="mt-5 space-y-4">
            {PRACTICES.map((practice) => (
              <article key={practice.title} className="ui-signal-card">
                <h3 className="ui-inline-title">{practice.title}</h3>
                <p className="ui-body mt-3">{practice.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <Projects />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.96fr)]">
        <section className="ui-panel p-6 sm:p-7">
          <p className="ui-kicker">Latest writing</p>
          {latestPost ? (
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ui-chip ui-chip--accent">Fresh note</span>
                {latestPost.date ? (
                  <span className="ui-meta">{formatDate(latestPost.date)}</span>
                ) : null}
              </div>

              <h2 className="ui-section-title max-w-2xl">
                {latestPost.title}
              </h2>

              {latestPost.summary ? (
                <p className="ui-body max-w-2xl">{latestPost.summary}</p>
              ) : null}

              <Link href={`/blog/${latestPost.slug}`} className="ui-button-secondary">
                Read the article
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <h2 className="ui-section-title">More writing is on the way.</h2>
              <p className="ui-body max-w-xl">
                I am using the blog as a place to turn project lessons and lab
                notes into something other people can actually use.
              </p>
            </div>
          )}
        </section>

        <section id="contact" className="ui-panel-strong p-6 sm:p-7">
          <p className="ui-kicker">Build with me</p>
          <h2 className="ui-section-title mt-4 max-w-lg">
            Looking for someone who can shape the interface and think beyond the
            happy path?
          </h2>
          <p className="ui-body mt-4 max-w-xl">
            Roles, freelance work, product ideas, or just swapping notes all
            fit here. A short message is enough.
          </p>

          <ContactForm />

          <div className="mt-5 flex flex-wrap gap-3">
            <MailButton label="Email me" />
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-button-secondary"
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-6 space-y-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-link-card"
              >
                <div>
                  <div className="ui-inline-title">{link.label}</div>
                  <div className="ui-body mt-1">{link.detail}</div>
                </div>
                <span className="ui-meta">Open</span>
              </a>
            ))}
          </div>
        </section>
      </section>

      <footer className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="font-sfmono text-xs uppercase tracking-[0.18em]">
          @smanve / frontend and systems
        </div>
        <div>Built with Next.js, MDX, and a bias for clarity.</div>
      </footer>
    </div>
  );
}
