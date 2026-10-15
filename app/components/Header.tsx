import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";

type HeaderProps = {
  user: {
    name: string;
    email: string;
  };
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div>
        
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-5 w-5" />
        </button>
        <Link href="/dashboard/mybooking" className="flex items-center gap-2 rounded-full pl-1 hover:bg-slate-50">
          <span className="hidden text-right sm:block">
            <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
            <span className="block max-w-40 truncate text-xs text-slate-500">{user.email}</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <CircleUserRound className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </header>
  )
}
