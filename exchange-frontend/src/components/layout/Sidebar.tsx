"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Navigation items for sidebar
 */
const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trade", href: "/trade" },
  { label: "History", href: "/history" },
];

/**
 * Sidebar Component
 * Side navigation for authenticated pages.
 * 
 * TODO: Add icons to nav items
 * TODO: Implement active state styling
 * TODO: Add collapsible functionality
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary-600/20 text-primary-500"
                : "hover:bg-gray-100"
            )}
          >
            {/* TODO: Add icon */}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
