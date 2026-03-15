import Link from "next/link";
import Image from "next/image";
import CardArrow from "../components/CardArrow";
import SiteSignal from "../components/SiteSignal";
import { getAllProjects } from "@/lib/projects";
import { formatDate } from "@/lib/formatDate";

export const metadata = {
  title: "Projects - @smanve",
  description:
    "Case studies, experiments, and systems labs from Manvendra Singh.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const [featured, ...rest] = projects;
  const tagCount = new Set(
    projects.flatMap((project) => project.tags?.filter(Boolean) ?? []),
  ).size;

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.88fr)]">
        <div className="ui-panel-strong px-6 py-8 sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="ui-chip ui-chip--accent">Work archive</span>
            <span className="ui-chip">Case studies</span>
            <span className="ui-chip">Labs</span>
          </div>

          <p className="ui-kicker mt-8">Projects</p>
          <h1 className="ui-page-title mt-4 max-w-4xl">
            Things I built when I wanted to understand the problem properly,
            not just get through it.
          </h1>
          <p className="ui-lead mt-5 max-w-2xl">
            Some started from curiosity. Some came from getting stuck. The ones
            worth keeping are the projects that made the next decision clearer:
            better UI, cleaner systems, stronger instincts.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="ui-proof-card">
              <p className="ui-meta">Published projects</p>
              <div className="ui-stat-value mt-2">{projects.length}</div>
            </article>
            <article className="ui-proof-card">
              <p className="ui-meta">Topic tags</p>
              <div className="ui-stat-value mt-2">{tagCount}</div>
            </article>
            <article className="ui-proof-card">
              <p className="ui-meta">Style of work</p>
              <div className="mt-2 text-base font-semibold text-[color:var(--text)]">
                Frontend + systems
              </div>
            </article>
          </div>
        </div>

        <SiteSignal />
      </section>

      {featured ? (
        <section className="ui-panel overflow-hidden">
          <Link
            href={`/projects/${featured.slug}`}
            className="group grid h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)]"
          >
            {featured.hero ? (
              <div className="relative min-h-[20rem] overflow-hidden border-b border-[color:var(--border)] lg:min-h-full lg:border-b-0 lg:border-r">
                <Image
                  src={featured.hero}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="ui-chip ui-chip--accent">Featured project</span>
                {featured.date ? (
                  <span className="ui-chip">{formatDate(featured.date)}</span>
                ) : null}
                <span className="ui-chip">{featured.readingTime} min read</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[clamp(1.8rem,2.6vw,2.7rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[color:var(--text)]">
                    {featured.title}
                  </h2>
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

              <div className="mt-auto flex flex-wrap gap-3">
                <span className="ui-button-secondary">Read case study</span>
                {featured.repo ? <span className="ui-meta">Code available</span> : null}
                {featured.demo ? <span className="ui-meta">Live demo available</span> : null}
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ui-kicker">More work</p>
            <h2 className="ui-section-title mt-3 max-w-3xl">
              The rest of the archive, including the smaller things that still
              taught me something real.
            </h2>
          </div>
        </div>

        {rest.length > 0 ? (
          <ul className="grid gap-4 lg:grid-cols-2">
            {rest.map((project) => (
              <li key={project.slug} className="ui-panel overflow-hidden">
                <Link href={`/projects/${project.slug}`} className="group block">
                  {project.hero ? (
                    <div className="relative h-56 w-full overflow-hidden border-b border-[color:var(--border)]">
                      <Image
                        src={project.hero}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="ui-kicker">Project</p>
                        <h3 className="ui-card-title mt-3">{project.title}</h3>
                      </div>
                      <CardArrow />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.date ? (
                        <span className="ui-chip">{formatDate(project.date)}</span>
                      ) : null}
                      <span className="ui-chip">{project.readingTime} min read</span>
                    </div>

                    {project.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="ui-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {project.summary ? (
                      <p className="ui-body">{project.summary}</p>
                    ) : null}
                  </div>
                </Link>

                <div className="flex flex-wrap gap-4 border-t border-[color:var(--border)] px-6 py-4 text-sm">
                  {project.repo && (
                    <a
                      className="ui-link"
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a
                      className="ui-link"
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ui-panel p-6 sm:p-7">
            <p className="ui-body max-w-2xl">
              The archive is still small, which is why each project page is
              written more like a case study than a screenshot dump.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
