"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

/**
 * Header Component
 * Main navigation header with logo, nav links, and auth buttons.
 * 
 * TODO: Implement responsive navigation
 * TODO: Add mobile menu
 * TODO: Style navigation links
 */
export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">HybridExchange</span>
          </Link>

          {/* Navigation - TODO: Implement nav links */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/trade">Trade</Link>
                <Link href="/history">History</Link>
              </>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.username}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
