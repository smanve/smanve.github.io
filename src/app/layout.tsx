import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Manvendra Singh</title>
        <meta
          name="description"
          content="Software engineer - cloud, security, and data. @smanve"
        />
        <meta name="author" content="Manvendra Singh" />

        {/* Open Graph */}
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

      <body className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] antialiased font-sans selection:bg-[color:var(--accent)] selection:text-white">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
