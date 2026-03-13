"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTheme =
      stored === "light" || stored === "dark"
        ? stored
        : media.matches
          ? "dark"
          : "light";

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setMounted(true);

    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return;

      const nextTheme = event.matches ? "dark" : "light";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={["ui-theme-toggle", theme === "dark" ? "is-dark" : "is-light"].join(" ")}
      aria-label={
        mounted ? `Switch to ${nextTheme} mode` : "Toggle light and dark mode"
      }
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      onClick={() => {
        const updatedTheme = theme === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, updatedTheme);
        applyTheme(updatedTheme);
        setTheme(updatedTheme);
      }}
    >
      <span aria-hidden="true" className="ui-theme-toggle__thumb" />
      <span
        aria-hidden="true"
        className={[
          "ui-theme-toggle__option",
          theme === "light" ? "is-active" : "",
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.7"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364l-1.06-1.06M6.697 6.697l-1.06-1.06m12.727 0l-1.06 1.06M6.697 17.303l-1.06 1.06M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
        <span className="ui-theme-toggle__label">Light</span>
      </span>
      <span
        aria-hidden="true"
        className={[
          "ui-theme-toggle__option",
          theme === "dark" ? "is-active" : "",
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.7"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 1118.998 2.25 7.5 7.5 0 0021.75 15c0 .001 0 .001.002.002z"
          />
        </svg>
        <span className="ui-theme-toggle__label">Dark</span>
      </span>
    </button>
  );
}
