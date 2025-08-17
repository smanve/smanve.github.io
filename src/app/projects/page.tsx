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
    <main className="mx-4 my-16 md:mx-0 space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="text-gray-600">Stuff I’m proud of (or learned a lot from).</p>

      <ul className="grid gap-6">
        {projects.map(p => (
          <li key={p.slug} className="border rounded-xl p-4 hover:shadow transition">
            <Link href={`/projects/${p.slug}`} className="block space-y-3">
              {p.hero ? (
                <div className="relative w-full h-44 overflow-hidden rounded-lg">
                  <Image src={p.hero} alt={p.title} fill className="object-cover" />
                </div>
              ) : null}
              <h2 className="text-xl font-semibold">{p.title}</h2>
              {p.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              {p.summary && <p className="opacity-80">{p.summary}</p>}
            </Link>

            <div className="mt-2 flex gap-4 text-sm">
              {p.repo && <a className="underline" href={p.repo} target="_blank">GitHub</a>}
              {p.demo && <a className="underline" href={p.demo} target="_blank">Live</a>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
