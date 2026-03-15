"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site";

type FormValues = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
  startedAt: string;
};

function createInitialValues(): FormValues {
  return {
    name: "",
    email: "",
    company: "",
    message: "",
    website: "",
    startedAt: String(Date.now()),
  };
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(createInitialValues);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(
          payload.error ||
            `Something went wrong. You can still email me at ${siteConfig.email}.`,
        );
        return;
      }

      setStatus("success");
      setMessage("Thanks, your message is on its way. I’ll get back to you soon.");
      setValues(createInitialValues());
    } catch {
      setStatus("error");
      setMessage(
        `The form could not send right now. You can still email me at ${siteConfig.email}.`,
      );
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="ui-form-field">
          <span className="ui-field-label">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            className="ui-input"
            placeholder="Your name"
            required
            maxLength={80}
          />
        </label>

        <label className="ui-form-field">
          <span className="ui-field-label">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            className="ui-input"
            placeholder="you@example.com"
            required
            maxLength={120}
          />
        </label>
      </div>

      <label className="ui-form-field">
        <span className="ui-field-label">Company or team</span>
        <input
          type="text"
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={(event) =>
            setValues((current) => ({ ...current, company: event.target.value }))
          }
          className="ui-input"
          placeholder="Optional"
          maxLength={120}
        />
      </label>

      <label className="ui-form-field">
        <span className="ui-field-label">What are you working on?</span>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) =>
            setValues((current) => ({ ...current, message: event.target.value }))
          }
          className="ui-input min-h-[10rem] resize-y"
          placeholder="A role, a project idea, a collaboration, or just a question."
          required
          minLength={24}
          maxLength={4000}
        />
      </label>

      <div className="ui-honeypot" aria-hidden="true">
        <label className="ui-form-field">
          <span className="ui-field-label">Website</span>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) =>
              setValues((current) => ({ ...current, website: event.target.value }))
            }
            className="ui-input"
          />
        </label>
      </div>

      <input type="hidden" name="startedAt" value={values.startedAt} readOnly />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="ui-button"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>

        <a href={`mailto:${siteConfig.email}`} className="ui-button-secondary">
          Email directly
        </a>
      </div>

      {message ? (
        <p
          className={[
            "ui-feedback",
            status === "error" ? "ui-feedback--error" : "ui-feedback--success",
          ].join(" ")}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
