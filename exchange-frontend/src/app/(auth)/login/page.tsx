"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * Login Page
 * User login form with email/username and password.
 * 
 * TODO: Implement form validation
 * TODO: Handle login errors
 * TODO: Add loading state
 * TODO: Redirect on success
 */
export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md" variant="bordered">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              type="text"
              value={formData.usernameOrEmail}
              onChange={(e) =>
                setFormData({ ...formData, usernameOrEmail: e.target.value })
              }
              placeholder="Enter your username or email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />

            {loginError && (
              <p className="text-sm text-red-500">
                Invalid credentials. Please try again.
              </p>
            )}

            <Button type="submit" className="w-full" isLoading={isLoggingIn}>
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
