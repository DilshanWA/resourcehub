import { signUp } from "@/app/actions/auth";
import AuthForm from "@/app/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-50 px-5 py-10 md:px-8">
      <div className="auth-panel">
        <div className="mb-10">
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-slate-600">Bring your team&apos;s resources into focus.</p>
        </div>
        <AuthForm mode="signup" action={signUp} />
      </div>
      {/*
      <div className="auth-visual">
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Simple by design</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight text-white">Make every resource count.</h2>
          <p className="mt-5 text-lg leading-8 text-indigo-100">A focused workspace for planning, sharing, and reserving the things that keep your team productive.</p>
        </div>
      </div>
       */}
      
    </main>
  );
}