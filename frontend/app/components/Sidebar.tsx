"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: Props) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Invoices", href: "/dashboard/invoices" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          bg-white border-r border-slate-200
          h-full
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "left-0" : "-left-64"}
          md:left-0
        `}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h2 className="font-bold text-indigo-600">
              Invoice SaaS
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-slate-500"
          >
            ☰
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm transition ${
                pathname === item.href
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {collapsed ? item.name[0] : item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}