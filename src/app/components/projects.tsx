import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";

export default function Projects() {
  const projects = getAllProjects().slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="ui-kicker">Selected work</p>
          <div>
            <h2 className="ui-section-title">
              A few things I built, and a few things I learned the hard way.
            </h2>
            <p className="ui-body mt-3 max-w-2xl">
              Some started as experiments. Some came from work I wanted to
              understand better. Each one pushed me a bit further.
            </p>
          </div>
        </div>

        <Link
          href="/projects"
          className="ui-button-secondary self-start"
        >
          View all projects
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug} className="ui-panel overflow-hidden">
            <Link
              href={`/projects/${project.slug}`}
              className="group flex h-full flex-col"
            >
              {project.hero ? (
                <div className="relative h-48 w-full overflow-hidden border-b border-[color:var(--border)]">
                  <Image
                    src={project.hero}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              ) : null}

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="ui-card-title">{project.title}</h3>
                  <span className="ui-meta transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </div>

                {project.summary ? (
                  <p className="ui-body">{project.summary}</p>
                ) : null}

                {project.tags?.length ? (
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="ui-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
