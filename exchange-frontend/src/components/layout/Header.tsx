"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/trade", label: "Trade" },
    { href: "/history", label: "History" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-50">
              HX
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-50">HybridExchange</p>
              <p className="text-xs text-slate-400">Stocks & Crypto</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-indigo-300"
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-xs text-slate-300">
                  Welcome, {user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {/* Mobile toggle (content not yet implemented) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-100"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      {/* TODO: Mobile drawer menu using `open` */}
    </header>
  );
}