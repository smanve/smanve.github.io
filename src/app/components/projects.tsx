import Link from "next/link";
import Image from "next/image";
import CardArrow from "./CardArrow";
import { getAllProjects } from "@/lib/projects";
import { formatDate } from "@/lib/formatDate";

export default function Projects() {
  const projects = getAllProjects().slice(0, 4);
  if (projects.length === 0) return null;

  const [featured, ...rest] = projects;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="ui-kicker">Selected work</p>
          <div>
            <h2 className="ui-section-title max-w-3xl">
              Case studies, labs, and shipped experiments that show how I work
              when the details matter.
            </h2>
            <p className="ui-body mt-3 max-w-2xl">
              I like projects that leave behind something useful: a clearer
              system, a better interface, a stronger mental model, or a write-up
              worth revisiting later.
            </p>
          </div>
        </div>

        <Link href="/projects" className="ui-button-secondary self-start">
          View all work
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.22fr)_minmax(19rem,0.78fr)]">
        <article className="ui-panel overflow-hidden">
          <Link
            href={`/projects/${featured.slug}`}
            className="group grid h-full lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]"
          >
            {featured.hero ? (
              <div className="relative min-h-[18rem] overflow-hidden border-b border-[color:var(--border)] lg:min-h-full lg:border-b-0 lg:border-r">
                <Image
                  src={featured.hero}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-5 p-6 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <span className="ui-chip ui-chip--accent">Featured case study</span>
                {featured.date ? (
                  <span className="ui-chip">{formatDate(featured.date)}</span>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-[clamp(1.7rem,2.6vw,2.45rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[color:var(--text)]">
                    {featured.title}
                  </h3>
                  <CardArrow />
                </div>

                {featured.summary ? (
                  <p className="ui-body max-w-xl">{featured.summary}</p>
                ) : null}
              </div>

              {featured.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="ui-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-3 text-sm">
                <span className="ui-link inline-flex items-center gap-2">
                  Open case study
                  <CardArrow />
                </span>

                {featured.repo ? (
                  <span className="ui-meta">Code available</span>
                ) : null}
              </div>
            </div>
          </Link>

          {(featured.repo || featured.demo) && (
            <div className="flex flex-wrap gap-4 border-t border-[color:var(--border)] px-6 py-4 text-sm sm:px-7">
              {featured.repo && (
                <a
                  className="ui-link"
                  href={featured.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
              {featured.demo && (
                <a
                  className="ui-link"
                  href={featured.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live
                </a>
              )}
            </div>
          )}
        </article>

        <div className="grid gap-4">
          {rest.length > 0 ? (
            rest.map((project) => (
              <article key={project.slug} className="ui-panel p-5 sm:p-6">
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="ui-kicker">Project</p>
                      <h3 className="ui-card-title mt-3">{project.title}</h3>
                    </div>
                    <CardArrow />
                  </div>

                  {project.summary ? (
                    <p className="ui-body mt-4">{project.summary}</p>
                  ) : null}

                  {project.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="ui-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </article>
            ))
          ) : (
            <article className="ui-panel p-6 sm:p-7">
              <p className="ui-kicker">Why this section exists</p>
              <h3 className="ui-section-title mt-4 text-[clamp(1.4rem,2vw,1.8rem)]">
                I want the portfolio to show thinking, not just screenshots.
              </h3>
              <p className="ui-body mt-4">
                The goal is to make the work legible: what I built, what I was
                trying to understand, what broke, and what I would improve next.
              </p>
              <Link href={`/projects/${featured.slug}`} className="ui-link mt-5 inline-flex">
                Read the full write-up
              </Link>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
