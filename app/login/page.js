"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff, FiFileText, FiLock, FiMail } from "react-icons/fi";

import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to sign in");
      if (data.sessionActive === false)
        throw new Error("Unable to establish a session");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between rounded-3xl border bg-card p-10 shadow-sm lg:flex">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <FiFileText className="h-9 w-9 text-primary" />
                <span className="text-2xl font-semibold">JD2CV</span>
              </Link>
              <h1 className="mt-10 max-w-md text-4xl font-semibold tracking-tight">
                ATS-friendly resumes, job tracking, and profile management in
                one place.
              </h1>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                A calmer shadcn-style interface for managing your job search.
              </p>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FiFileText className="h-6 w-6" />
              </div>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Or{" "}
                <Link
                  href="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  create a new account
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((s) => ({ ...s, email: e.target.value }))
                      }
                      className="pl-9"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((s) => ({ ...s, password: e.target.value }))
                      }
                      className="pl-9 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
