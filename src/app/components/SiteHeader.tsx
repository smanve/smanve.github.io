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
    <header
      className="
        sticky top-0 z-30
        bg-[var(--surface)]/90 backdrop-blur
        
      "
    >
      <nav className="mx-auto max-w-screen-sm px-4 py-3 flex gap-4 text-sm">
        {items.map(({ href, label }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`underline-offset-4 hover:underline ${
                active ? "text-primary underline" : "text-primary/70"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
