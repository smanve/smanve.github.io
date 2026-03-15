# smanve portfolio

Personal portfolio built with Next.js, TypeScript, Tailwind, and MDX.

## Local development

```bash
npm install
npm run dev
```

## Environment setup

Copy `.env.example` to `.env.local` and fill in the values.

- `NEXT_PUBLIC_SITE_URL`: canonical site URL used for feed and metadata
- `RESEND_API_KEY`: API key for sending contact form emails with Resend
- `CONTACT_FROM_EMAIL`: verified sender identity for outgoing messages
- `CONTACT_TO_EMAIL`: inbox that should receive portfolio enquiries

If the contact env vars are missing, the form will stay visible but return a
friendly configuration error and the direct email fallback still works.

## Notable features

- MDX-powered projects and notes
- Reading time and generated table of contents for detail pages
- Live site signal route at `/api/site-signal`
- RSS feed at `/feed.xml`
- Generated sitemap and robots metadata
- Contact form with validation, honeypot spam trap, and rate limiting
