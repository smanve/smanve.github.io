import Link from "next/link";
import Image from "next/image";
import CardArrow from "../components/CardArrow";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects - @smanve",
  description: "Projects, experiments, and labs that taught me something real.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="ui-kicker">Projects</p>
        <h1 className="ui-page-title max-w-3xl">
          Things I built when I wanted to learn something for real.
        </h1>
        <p className="ui-lead max-w-2xl">
          Some began with curiosity. Some began because I got stuck and wanted
          to understand the problem properly. Either way, I shipped something.
        </p>
      </div>

      <ul className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
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
                  <h2 className="ui-card-title">{project.title}</h2>
                  <CardArrow />
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

            <div className="flex gap-4 px-6 pb-6 text-sm">
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
    </section>
  );
}
