"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({
  setMobileOpen,
}: {
  setMobileOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  // Persist theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 transition-colors duration-300">

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden text-xl dark:text-white"
      >
        ☰
      </button>

      <h1 className="font-semibold text-slate-700 dark:text-white">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <button
          onClick={toggleDark}
          className="text-lg dark:text-white"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
}