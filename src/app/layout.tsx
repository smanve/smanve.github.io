import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const themeScript = `
  (function () {
    try {
      var root = document.documentElement;
      var stored = localStorage.getItem("theme");
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = stored === "light" || stored === "dark"
        ? stored
        : (systemDark ? "dark" : "light");

      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.style.colorScheme = theme;
    } catch (error) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <title>Manvendra Singh</title>
        <meta
          name="description"
          content="Software engineer - cloud, security, and data. @smanve"
        />
        <meta name="author" content="Manvendra Singh" />

        <meta property="og:title" content="Manvendra Singh" />
        <meta
          property="og:description"
          content="Software engineer - cloud, security, and data. @smanve"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://manvendra.me" />
        <meta property="og:image" content="/og-image.png" />

        <link rel="canonical" href="https://manvendra.me" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
          {children}
        </main>
      </body>
    </html>
  );
}
