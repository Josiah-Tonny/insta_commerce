import React, { useState, useEffect } from "react";

// Utility for toggling dark mode
function setTheme(theme) {
  if (theme === "system") {
    window.localStorage.removeItem("theme");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else {
    window.localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

export default function SettingsPage() {
  const [theme, setThemeState] = useState(() => {
    return window.localStorage.getItem("theme") || "system";
  });

  // Listen to system theme changes if "system" is selected
  useEffect(() => {
    function handleSystemThemeChange(e) {
      if (theme === "system") {
        setTheme("system");
      }
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);
    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1
          className="
            text-xl sm:text-2xl md:text-3xl font-bold
            bg-gradient-to-r from-instaPink via-instaPurple to-instaPink
            bg-clip-text text-transparent
            mb-6
          "
        >
          Settings & Preferences
        </h1>
        <section className="mb-8">
          <h2
            className="
              text-lg sm:text-xl md:text-2xl font-semibold
              bg-gradient-to-r from-instaPink via-instaPurple to-instaPink
              bg-clip-text text-transparent
              mb-2
            "
          >
            Theme
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setThemeState("light")}
                className="form-radio text-instaPink"
              />
              <span className="text-base">Light</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setThemeState("dark")}
                className="form-radio text-instaPink"
              />
              <span className="text-base">Dark</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={() => setThemeState("system")}
                className="form-radio text-instaPink"
              />
              <span className="text-base">System Setting</span>
            </label>
          </div>
        </section>
        <section>
          <h2
            className="
              text-lg sm:text-xl md:text-2xl font-semibold
              bg-gradient-to-r from-instaPink via-instaPurple to-instaPink
              bg-clip-text text-transparent
              mb-2
            "
          >
            Typography Scale Example
          </h2>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Heading 1</h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Heading 2</h2>
            <p className="text-base">
              This is base text (16px). All body text uses <span className="font-mono">text-base</span> for consistency.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}