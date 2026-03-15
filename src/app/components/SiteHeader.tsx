"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Notes" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg-strong)]/92 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-3 rounded-full border border-transparent px-3 py-2 text-left text-sm font-medium text-[color:var(--text)] hover:border-[color:var(--border)] hover:bg-[color:var(--surface)]"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-[color:var(--accent)] opacity-70 blur-[2px]" />
            <span className="relative rounded-full bg-[color:var(--accent)]" />
          </span>
          <span className="min-w-0">
            <span className="block font-sfmono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              smanve
            </span>
            <span className="block text-sm text-[color:var(--text)] sm:hidden">
              Manvendra
            </span>
            <span className="hidden truncate text-sm text-[color:var(--text)] sm:block">
              Manvendra Singh / frontend and systems
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
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
                  "rounded-full px-3 py-2 transition-colors sm:px-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                  active
                    ? "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--text)] shadow-[var(--shadow-panel)]"
                    : "text-[color:var(--muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}

          <ThemeToggle />
          <Link href="/#contact" className="ui-contact-button hidden lg:inline-flex">
            Say hello
          </Link>
        </div>
      </nav>
    </header>
  );
}
