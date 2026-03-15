import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const MIN_MESSAGE_LENGTH = 24;
const MIN_FORM_FILL_MS = 2500;

type ContactSubmission = {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
  startedAt?: string;
};

type ContactRateStore = Map<string, number[]>;

function getRateStore() {
  const globalScope = globalThis as typeof globalThis & {
    __contactRateStore?: ContactRateStore;
  };

  if (!globalScope.__contactRateStore) {
    globalScope.__contactRateStore = new Map();
  }

  return globalScope.__contactRateStore;
}

function trimField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(key: string) {
  const store = getRateStore();
  const now = Date.now();
  const recentAttempts = (store.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    store.set(key, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  store.set(key, recentAttempts);
  return false;
}

function validateSubmission(input: ContactSubmission) {
  const errors: string[] = [];

  if (input.website) {
    return { ok: false as const, silent: true as const, errors };
  }

  const startedAtValue = Number(input.startedAt);
  if (
    !input.startedAt ||
    Number.isNaN(startedAtValue) ||
    Date.now() - startedAtValue < MIN_FORM_FILL_MS
  ) {
    return { ok: false as const, silent: true as const, errors };
  }

  if (input.name.length < 2 || input.name.length > 80) {
    errors.push("Please enter a valid name.");
  }

  if (!isValidEmail(input.email) || input.email.length > 120) {
    errors.push("Please enter a valid email address.");
  }

  if (input.company && input.company.length > 120) {
    errors.push("Company name is too long.");
  }

  if (
    input.message.length < MIN_MESSAGE_LENGTH ||
    input.message.length > 4000
  ) {
    errors.push("Please include a bit more detail in your message.");
  }

  return { ok: errors.length === 0, silent: false as const, errors };
}

async function sendViaResend({
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      message: "Missing RESEND_API_KEY.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    return {
      ok: false,
      status: response.status,
      message: payload || "Email provider rejected the request.",
    };
  }

  return { ok: true, status: 200, message: "Delivered" };
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | null = null;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const submission: ContactSubmission = {
    name: trimField(payload.name),
    email: trimField(payload.email),
    company: trimField(payload.company),
    message: trimField(payload.message),
    website: trimField(payload.website),
    startedAt: trimField(payload.startedAt),
  };

  const validation = validateSubmission(submission);
  if (!validation.ok && validation.silent) {
    return NextResponse.json({ ok: true });
  }

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.errors[0] ?? "Invalid submission." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages from this connection. Please try again later.",
      },
      { status: 429 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The contact form is not configured yet. Please use direct email for now.",
      },
      { status: 503 },
    );
  }

  const subjectName = submission.name.replace(/\s+/g, " ").slice(0, 60);
  const subject = `Portfolio enquiry from ${subjectName}`;
  const userAgent = request.headers.get("user-agent") ?? "Unknown";
  const safeName = escapeHtml(submission.name);
  const safeEmail = escapeHtml(submission.email);
  const safeCompany = escapeHtml(submission.company || "Not provided");
  const safeIp = escapeHtml(ip);
  const safeAgent = escapeHtml(userAgent);
  const safeMessage = escapeHtml(submission.message).replace(/\n/g, "<br />");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171a23">
      <h2>New portfolio enquiry</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Company:</strong> ${safeCompany}</p>
      <p><strong>IP:</strong> ${safeIp}</p>
      <p><strong>User Agent:</strong> ${safeAgent}</p>
      <hr />
      <p>${safeMessage}</p>
    </div>
  `;
  const text = [
    "New portfolio enquiry",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${safeCompany}`,
    `IP: ${ip}`,
    `User Agent: ${userAgent}`,
    "",
    submission.message,
  ].join("\n");

  const result = await sendViaResend({
    from,
    to,
    replyTo: submission.email,
    subject,
    html,
    text,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The message could not be delivered right now. You can still email me directly.",
      },
      { status: result.status >= 400 ? result.status : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
