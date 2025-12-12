"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Portfolio", href: "/portfolio", icon: "💼" },
  { label: "Trade", href: "/trade", icon: "⚡" },
  { label: "History", href: "/history", icon: "🧾" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-slate-800/70 bg-slate-950/70 backdrop-blur-xl text-slate-100">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
            HX
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-50">HybridExchange</p>
            <p className="text-xs text-slate-400">Stocks & Crypto</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                  "border border-transparent",
                  active
                    ? "border-slate-800 bg-indigo-500/15 text-indigo-100"
                    : "text-slate-200 hover:bg-slate-900/60 hover:border-slate-800"
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}