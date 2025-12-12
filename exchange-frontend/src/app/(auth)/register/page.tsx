"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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
      toast.success("Account created");
      setDidSubmit(false);
    }
  }, [didSubmit, isRegistering, isAuthenticated]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md" variant="bordered">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="mt-2">Start trading stocks and crypto</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="johndoe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 6 characters"
              required
            />

            {registerError && (
              <p className="text-sm text-red-500">Registration failed. Please try again.</p>
            )}

            <Button type="submit" className="w-full" isLoading={isRegistering}>
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}