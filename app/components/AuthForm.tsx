"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/actions/auth";

type AuthAction = (
  state: AuthState | undefined,
  formData: FormData,
) => Promise<AuthState>;

type AuthFormProps = {
  mode: "login" | "signup";
  action: AuthAction;
};

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {isSignup && (
        <div>
          <label htmlFor="name" className="auth-label">Full name</label>
          <input id="name" name="name" required autoComplete="name" className="auth-input" placeholder="Alex Morgan" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="auth-label">Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="auth-input" placeholder="you@company.com" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="auth-label">Password</label>
          {!isSignup && <span className="text-xs text-slate-500">Secure sign-in</span>}
        </div>
        <input id="password" name="password" type="password" required minLength={8} autoComplete={isSignup ? "new-password" : "current-password"} className="auth-input" placeholder="••••••••" />
        {isSignup && <p className="mt-2 text-xs text-slate-500">At least 8 characters, including a number.</p>}
      </div>
      {state?.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="auth-button">
        {pending ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        {isSignup ? "Already have an account?" : "New to ResourceHub?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-indigo-600 hover:text-indigo-500">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
