"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formatDate";

type SiteSignalData = {
  endpoint: string;
  generatedAt: string;
  updatedAt: string | null;
  projectCount: number;
  postCount: number;
  tagCount: number;
  latestProject: {
    slug: string;
    title: string;
    date: string;
    readingTime: number;
  } | null;
  latestPost: {
    slug: string;
    title: string;
    date: string;
    readingTime: number;
  } | null;
};

type SiteSignalProps = {
  className?: string;
};

export default function SiteSignal({ className = "" }: SiteSignalProps) {
  const [data, setData] = useState<SiteSignalData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSignal() {
      try {
        const response = await fetch("/api/site-signal", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as SiteSignalData;
        setData(payload);
        setStatus("ready");
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setStatus("error");
      }
    }

    loadSignal();
    return () => controller.abort();
  }, []);

  return (
    <section className={["ui-panel p-5 sm:p-6", className].join(" ").trim()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ui-kicker">Live site signal</p>
          <h3 className="ui-inline-title mt-3">
            Published content, served from a small route handler.
          </h3>
        </div>

        <span className="ui-live-pill">
          <span
            className={[
              "ui-live-dot",
              status === "error" ? "is-error" : "",
              status === "loading" ? "is-loading" : "",
            ].join(" ")}
            aria-hidden="true"
          />
          {status === "ready" ? "Live" : status === "loading" ? "Loading" : "Retry"}
        </span>
      </div>

      {status === "ready" && data ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="ui-signal-card">
              <div className="ui-meta">Projects</div>
              <div className="ui-stat-value mt-2">{data.projectCount}</div>
            </article>

            <article className="ui-signal-card">
              <div className="ui-meta">Notes</div>
              <div className="ui-stat-value mt-2">{data.postCount}</div>
            </article>

            <article className="ui-signal-card">
              <div className="ui-meta">Topic tags</div>
              <div className="ui-stat-value mt-2">{data.tagCount}</div>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="ui-signal-card">
              <p className="ui-meta">Latest project</p>
              {data.latestProject ? (
                <>
                  <Link
                    href={`/projects/${data.latestProject.slug}`}
                    className="mt-2 block text-base font-semibold text-[color:var(--text)]"
                  >
                    {data.latestProject.title}
                  </Link>
                  <p className="ui-meta mt-2">
                    {data.latestProject.date
                      ? formatDate(data.latestProject.date)
                      : "Undated"}
                    {" / "}
                    {data.latestProject.readingTime} min read
                  </p>
                </>
              ) : (
                <p className="ui-body mt-2">No project is published yet.</p>
              )}
            </article>

            <article className="ui-signal-card">
              <p className="ui-meta">Latest note</p>
              {data.latestPost ? (
                <>
                  <Link
                    href={`/blog/${data.latestPost.slug}`}
                    className="mt-2 block text-base font-semibold text-[color:var(--text)]"
                  >
                    {data.latestPost.title}
                  </Link>
                  <p className="ui-meta mt-2">
                    {data.latestPost.date
                      ? formatDate(data.latestPost.date)
                      : "Undated"}
                    {" / "}
                    {data.latestPost.readingTime} min read
                  </p>
                </>
              ) : (
                <p className="ui-body mt-2">Writing is still warming up.</p>
              )}
            </article>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="ui-meta">
              Last content update:{" "}
              {data.updatedAt ? formatDate(data.updatedAt) : "No publish date yet"}
            </p>
            <code className="ui-code-label">{data.endpoint}</code>
          </div>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="ui-signal-card">
              <div className="ui-skeleton-line h-3 w-20" />
              <div className="ui-skeleton-line mt-4 h-9 w-14" />
            </div>
          ))}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 ui-signal-card">
          <p className="ui-body">
            The live signal could not load right now, but the endpoint is wired
            in and can be retried on refresh.
          </p>
        </div>
      ) : null}
    </section>
  );
}
