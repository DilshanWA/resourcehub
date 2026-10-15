import { signIn } from "@/app/actions/auth";
import AuthForm from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-50 px-5 py-10 md:px-8">
      <div className="auth-panel">
        <div className="mb-10">
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in to manage your shared resources.</p>
        </div>
        <AuthForm mode="login" action={signIn} />
      </div>
      {
        /*<div className="auth-visual">
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Work better together</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight text-white">Everything your team needs, in one calm place.</h2>
          <p className="mt-5 text-lg leading-8 text-indigo-100">Reserve rooms, share equipment, and keep your organization moving without the busywork.</p>
        </div>
      </div>
       */
      }  
    </main>
  );
}