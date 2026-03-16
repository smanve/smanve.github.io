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
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:min-w-0">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-2.5 rounded-full border border-transparent px-2.5 py-1.5 text-left text-sm font-medium text-[color:var(--text)] hover:border-[color:var(--border)] hover:bg-[color:var(--surface)] sm:gap-3 sm:px-3 sm:py-2"
          >
            <span className="ui-live-dot ui-live-dot--hero shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-sfmono text-[0.64rem] uppercase tracking-[0.18em] text-[color:var(--muted)] sm:text-[0.7rem]">
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

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="ui-header-nav mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 lg:mt-0 lg:ml-8 lg:flex-1 lg:overflow-visible lg:pb-0">
          {items.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[0.94rem] transition-colors sm:px-4 sm:text-sm",
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

          <div className="hidden shrink-0 items-center gap-2 lg:ml-auto lg:flex">
            <ThemeToggle />
            <Link href="/#contact" className="ui-contact-button">
              Say hello
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
