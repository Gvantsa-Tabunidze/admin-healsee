"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
};

// Only allow same-site paths, so ?next= can't redirect to another website
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "confirmation"
      ? "That confirmation link is invalid or expired. Please sign in or register again."
      : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const isLogin = mode === "login";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!isLogin && password !== formData.get("confirmPassword")) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);
    const supabase = createSupabaseClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      router.replace(safeNext(searchParams.get("next")));
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    // No session means Supabase requires email confirmation first
    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      setMessage(`We sent a confirmation link to ${email}. Open it to finish signing up.`);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand login-brand">
          <span className="brand-mark">h</span>
          <span>healsee</span>
        </div>
        <p className="eyebrow">Admin workspace</p>
        <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="subheading">
          {isLogin
            ? "Sign in to continue managing your shop."
            : "Register to start managing your shop."}
        </p>
        <form className="login-form" onSubmit={submit}>
          <label className="field">
            <span>Email address</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              required
              name="password"
              type="password"
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
            />
          </label>
          {!isLogin && (
            <label className="field">
              <span>Confirm password</span>
              <input
                required
                name="confirmPassword"
                type="password"
                minLength={6}
                autoComplete="new-password"
                placeholder="Repeat your password"
              />
            </label>
          )}
          {error && (
            <p className="form-message form-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="form-message form-success" role="status">
              {message}
            </p>
          )}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
        <p className="login-back">
          {isLogin ? (
            <>
              No account yet? <Link href="/register">Create one</Link>
            </>
          ) : (
            <>
              Already registered? <Link href="/login">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
