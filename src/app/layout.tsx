import "./globals.css";
import localFont from "next/font/local";
import SiteHeader from "./components/SiteHeader";
import { siteConfig } from "@/lib/site";

const sfMono = localFont({
  src: [
    {
      path: "../../assets/fonts/SFMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SFMono-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../assets/fonts/SFMono-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SFMono-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-mono",
});

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
    <html lang="en" suppressHydrationWarning className={sfMono.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <title>{siteConfig.title}</title>
        <meta
          name="description"
          content={siteConfig.description}
        />
        <meta name="author" content={siteConfig.name} />

        <meta property="og:title" content={siteConfig.title} />
        <meta
          property="og:description"
          content={siteConfig.description}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content="/og-image.png" />

        <link rel="canonical" href={siteConfig.url} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} feed`}
          href="/feed.xml"
        />
      </head>

      <body className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
