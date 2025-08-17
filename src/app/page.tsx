// src/app/page.tsx
import Link from "next/link";
import Projects from "./components/projects";
import ParticlesBackground from "./ParticlesBackground";

// External links (shown as a compact 3-column row, wrapping on small screens)
const LINKS = [
  { href: "https://github.com/smanve", label: "gh/smanve", cta: "GitHub" },
  {
    href: "https://rxresu.me/manvendrasingh1999/continuous-genuine-barracuda",
    label: "rxresu.me",
    cta: "Resume",
  },
  {
    href: "https://www.linkedin.com/in/manvendrasingh1999/",
    label: "li/manvendra.singh",
    cta: "LinkedIn",
  },
];

export default function Page() {
  return (
    <div className="relative flex flex-col gap-8 mx-4 my-16 md:mx-0">
      <ParticlesBackground />

      {/* Intro */}
      <section aria-labelledby="intro" className="flex flex-col gap-4">
        <h1 id="intro" className="text-3xl font-bold">
          Hi <span className="text-primary">There!</span>{" "}
          <span className="px-2 py-1 text-xs rounded-md text-white bg-primary/70">
            <span>smanve</span>
          </span>
        </h1>

        <div>
          <span className="font-bold">I'm Manvendra</span>
          <br />
          <span className="text-zinc-700">
            software engineer located in Melbourne, AU
          </span>
          <br />
        </div>

        <hr className="border-t border-gray-300 my-2" />

        <p className="text-left">
          I'm a recent graduate with a strong foundation in web development
          (HTML, CSS, JavaScript) and frameworks like React &amp; Angular. I{" "}
          <b>love building</b> user-friendly web applications and problem
          solving!
          <br />
          <br />
          Outside of programming my interests include, but are not limited to
          music <b>and</b> gaming!
        </p>
      </section>

      <hr className="border-t border-gray-300 my-2" />

      {/* Projects teaser */}
      <section aria-labelledby="projects">
        <Projects />
      </section>

      <hr className="border-t border-gray-300 my-2" />

      {/* Links — compact, modern, accessible */}
      <section aria-labelledby="links" className="space-y-4">
        <h2 id="links" className="font-sfmono text-2xl">
          Links
        </h2>

        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.cta} – opens in a new tab`}
                className="
                  group block rounded-xl
                  bg-[#0b1220] text-zinc-100
                  p-3 text-sm transition
                  hover:shadow-md
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-primary/70
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]
                "
              >
                <div className="font-mono">{l.label}</div>
                <div className="mt-2 inline-flex items-center gap-1 rounded bg-amber-700/90 px-2 py-0.5 text-xs">
                  <span>{l.cta}</span>
                  {/* external-link icon (decorative) */}
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M13.5 3h7.5v7.5h-1.5V5.56l-9.22 9.22-1.06-1.06L18.44 4.5H13.5V3ZM5 5h6v1.5H6.5A1.5 1.5 0 0 0 5 8v9.5A1.5 1.5 0 0 0 6.5 19h9.5a1.5 1.5 0 0 0 1.5-1.5V13H19v4.5A3 3 0 0 1 16 20.5H6.5A3 3 0 0 1 3.5 17.5V8A3 3 0 0 1 6.5 5.5H11V5H5Z" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-t border-gray-300 my-2" />

      {/* Contact */}
      <section aria-labelledby="contact" className="space-y-4">
        <h2 id="contact" className="font-sfmono text-2xl">
          Contact
        </h2>
        <p>
          <a
            href="mailto:manvendrasingh1999@gmail.com"
            className="
              inline-flex items-center gap-2 font-bold underline
              text-primary/70 hover:text-primary
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-primary/70 focus-visible:ring-offset-2
              focus-visible:ring-offset-[var(--surface)]
            "
          >
            email
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </p>
      </section>

      <hr className="border-t border-gray-300 my-2" />

      <footer>
        <h2 className="font-sfmono text-l">
          {"@smanve " + new Date().getFullYear()}
        </h2>
      </footer>
    </div>
  );
}
