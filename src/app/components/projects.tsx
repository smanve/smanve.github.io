// Server Component (no "use client")
// Shows top 2–3 projects from content/projects/*.mdx
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";

export default function Projects() {
  // Grab latest 3 projects (by date desc)
  const projects = getAllProjects().slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-sfmono text-2xl">Projects</h2>
        <Link
          href="/projects"
          className="underline text-primary/70 hover:text-primary"
        >
          View all
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <li
            key={p.slug}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <Link href={`/projects/${p.slug}`} className="block space-y-2">
              {p.hero ? (
                <div className="relative w-full h-36 overflow-hidden rounded">
                  <Image
                    src={p.hero}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="font-semibold">{p.title}</div>
              {p.summary && (
                <p className="text-sm opacity-80">{p.summary}</p>
              )}

              {p.tags?.length ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
