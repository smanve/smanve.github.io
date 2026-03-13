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
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg-strong)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[color:var(--text)] hover:bg-[color:var(--surface)]"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_6px_var(--accent-soft)]" />
          <span className="font-sfmono text-xs uppercase tracking-[0.18em]">
            smanve
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
                  "rounded-full px-4 py-2 transition-colors",
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

          <a
            href="mailto:manvendrasingh1999@gmail.com"
            className="ui-button-secondary hidden sm:inline-flex"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
