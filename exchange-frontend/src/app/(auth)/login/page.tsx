"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  
  const didSubmitRef = useRef(false);
  const hasShownAuthToastRef = useRef(false);

  useEffect(() => {
    if (loginError && didSubmitRef.current) {
      toast.error("Login failed. Check your credentials and try again.");
      didSubmitRef.current = false;
    }
  }, [loginError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    didSubmitRef.current = true;
    login(formData);
  };

  useEffect(() => {
    if (isAuthenticated && !hasShownAuthToastRef.current) {
      hasShownAuthToastRef.current = true;
      if (didSubmitRef.current) {
        toast.success("Welcome back");
        didSubmitRef.current = false;
      }
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-600/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl" />
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo - Extra Large with spin and float animation */}
          <div className="mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/HD_investing_logo.png"
              alt="HD Investing Corp"
              className="w-[420px] h-[420px] object-contain drop-shadow-2xl animate-logo-spin-float"
            />
          </div>
          
          {/* Decorative lines */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-20 h-px bg-gradient-to-r from-transparent to-gold-600/60"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-gold-600">Premium Trading</span>
            <span className="w-20 h-px bg-gradient-to-l from-transparent to-gold-600/60"></span>
          </div>
          
          {/* Tagline */}
          <p className="text-center text-neutral-400 max-w-md text-base leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Access global markets with confidence. Trade stocks and cryptocurrency on a platform built for discerning investors.
          </p>

          {/* Stats or features */}
          <div className="grid grid-cols-3 gap-8 mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-2xl font-serif text-white">24/7</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1">Trading</p>
            </div>
            <div className="text-center border-x border-neutral-800 px-8">
              <p className="text-2xl font-serif text-white">100+</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1">Assets</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif text-white">Secure</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1">Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-neutral-950 to-black">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing Corp"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-600/50"></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600/70">Sign In</span>
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-600/50"></span>
            </div>
          </div>

          {/* Form Header */}
          <div className="hidden lg:block text-center mb-10">
            <h1 className="text-3xl font-serif text-white mb-2">Welcome Back</h1>
            <p className="text-neutral-500 text-sm">Sign in to access your portfolios</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={formData.usernameOrEmail}
                onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                placeholder="Enter your username or email"
                required
                className="w-full px-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded bg-danger-500/10 border border-danger-500/20">
                <p className="text-sm text-danger-400">Invalid credentials. Please try again.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded hover:shadow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <span className="flex-1 h-px bg-neutral-800"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">New here?</span>
            <span className="flex-1 h-px bg-neutral-800"></span>
          </div>

          {/* Sign Up Link */}
          <Link href="/register" className="block">
            <button className="w-full py-4 border border-neutral-800 text-neutral-400 font-medium rounded hover:border-gold-600/30 hover:text-white hover:bg-gold-600/5 transition-all duration-300">
              Create an Account
            </button>
          </Link>

          {/* Footer */}
          <p className="text-center text-[10px] text-neutral-600 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
