import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects - @smanve",
  description: "Things I’ve built, broken, and learned from.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="text-[color:var(--muted)]">
        Stuff I’m proud of (or learned a lot from).
      </p>

      <ul className="grid gap-6">
        {projects.map((p) => (
          <li key={p.slug} className="ui-card p-4 transition-colors">
            <Link href={`/projects/${p.slug}`} className="block space-y-3">
              {p.hero ? (
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-[color:var(--border)]">
                  <Image src={p.hero} alt={p.title} fill className="object-cover" />
                </div>
              ) : null}

              <h2 className="text-xl font-semibold">{p.title}</h2>

              {p.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="ui-badge text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {p.summary && (
                <p className="text-[color:var(--muted)]">{p.summary}</p>
              )}
            </Link>

            <div className="mt-3 flex gap-4 text-sm">
              {p.repo && (
                <a className="ui-link" href={p.repo} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {p.demo && (
                <a className="ui-link" href={p.demo} target="_blank" rel="noreferrer">
                  Live
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
