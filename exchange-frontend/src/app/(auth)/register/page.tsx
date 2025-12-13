"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register, isRegistering, registerError, isAuthenticated } = useAuth();
  const [didSubmit, setDidSubmit] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDidSubmit(true);
    register(formData);
  };

  useEffect(() => {
    if (didSubmit && registerError) {
      toast.error("Registration failed. Please try again.");
      setDidSubmit(false);
    }
  }, [didSubmit, registerError]);

  useEffect(() => {
    if (didSubmit && !isRegistering && isAuthenticated) {
      toast.success("Welcome to HD Investing");
      setDidSubmit(false);
    }
  }, [didSubmit, isRegistering, isAuthenticated]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gold-600/5 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl" />
          {/* Diagonal lines pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 50px,
                rgba(201, 169, 98, 0.5) 50px,
                rgba(201, 169, 98, 0.5) 51px
              )`
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo - Extra Large with spin and float animation */}
          <div className="mb-12 logo-hover-float">
            <div className="logo-spin-settle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing Corp"
                className="w-[400px] h-[400px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Decorative lines */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="w-20 h-px bg-gradient-to-r from-transparent to-gold-600/60"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-gold-600">Join Today</span>
            <span className="w-20 h-px bg-gradient-to-l from-transparent to-gold-600/60"></span>
          </div>
          
          {/* Tagline */}
          <p className="text-center text-neutral-400 max-w-sm leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Create your account and start building your investment portfolio with our premium trading platform.
          </p>

          {/* Benefits */}
          <div className="mt-12 space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              "Multi-portfolio management",
              "Real-time market data",
              "Secure & encrypted platform",
              "24/7 crypto trading"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                <span className="text-sm text-neutral-400">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-neutral-950 to-black">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing Corp"
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-600/50"></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600/70">Create Account</span>
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-600/50"></span>
            </div>
          </div>

          {/* Form Header */}
          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Create Account</h1>
            <p className="text-neutral-500 text-sm">Start your investment journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                required
                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
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
                placeholder="Min 6 characters"
                required
                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
              />
            </div>

            {registerError && (
              <div className="p-3 rounded bg-danger-500/10 border border-danger-500/20">
                <p className="text-sm text-danger-400">Registration failed. Please try again.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded hover:shadow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-2"
            >
              <span className="relative z-10">
                {isRegistering ? "Creating account..." : "Create Account"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-neutral-800"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">Already a member?</span>
            <span className="flex-1 h-px bg-neutral-800"></span>
          </div>

          {/* Sign In Link */}
          <Link href="/login" className="block">
            <button className="w-full py-3.5 border border-neutral-800 text-neutral-400 font-medium rounded hover:border-gold-600/30 hover:text-white hover:bg-gold-600/5 transition-all duration-300">
              Sign In Instead
            </button>
          </Link>

          {/* Footer */}
          <p className="text-center text-[10px] text-neutral-600 mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
