"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/trade", label: "Trade" },
    { href: "/history", label: "History" },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-black/90 backdrop-blur-xl border-b border-neutral-800/50 shadow-elegant" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing Corp"
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-serif font-semibold text-white tracking-wide">
                  HD INVESTING
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-600">
                  Corporation
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {isAuthenticated &&
                navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 relative ${
                        isActive 
                          ? "text-gold-500" 
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                      )}
                    </Link>
                  );
                })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="hidden lg:inline text-xs text-neutral-500">
                    Welcome, <span className="text-gold-600 font-medium">{user?.username}</span>
                  </span>
                  <button 
                    onClick={logout}
                    className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <button className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded hover:shadow-gold transition-all duration-200">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
              {/* Mobile toggle */}
              <button
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-neutral-800 bg-black/50 text-white hover:border-gold-600/50 transition-all duration-200"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-neutral-900 to-black border-l border-neutral-800 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/HD_investing_logo.png"
                  alt="HD Investing Corp"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span className="text-sm font-serif font-semibold text-white">HD INVESTING</span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gold-600">Corporation</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Info (if authenticated) */}
            {isAuthenticated && user && (
              <div className="p-5 border-b border-neutral-800 bg-neutral-900/50">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Signed in as</p>
                <p className="text-sm font-semibold text-white mt-1">{user.username}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="p-5 space-y-1">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 ${
                          isActive 
                            ? "bg-gold-500/10 text-gold-500 border border-gold-500/20" 
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                        }`}
                      >
                        <span className="font-medium tracking-wide">{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-200"
                    >
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" className="block">
                    <button className="w-full py-3 text-sm font-medium text-neutral-300 border border-neutral-700 rounded hover:border-neutral-600 hover:text-white transition-all duration-200">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" className="block">
                    <button className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded hover:shadow-gold transition-all duration-200">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Footer decoration */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-neutral-800">
              <div className="flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-600/50"></span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Est. 2024</span>
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-600/50"></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
