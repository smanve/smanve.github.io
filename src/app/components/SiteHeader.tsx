"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2 text-sm">
        {items.map(({ href, label }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={[
                "rounded-md px-2.5 py-1.5 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                active
                  ? "bg-[color:var(--surface)] text-[color:var(--text)]"
                  : "text-[color:var(--muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
