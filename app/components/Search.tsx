
"use client";

import { Search as SearchIcon, X } from "lucide-react";

export default function ResourceSearch({
  query = "",
  action = "/dashboard/resources",
  placeholder = "Search by name, type, or location",
  ariaLabel = "Search resources",
}: {
  query?: string;
  action?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <form action={action} method="get" className="relative w-full sm:w-80">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        aria-label={ariaLabel}
        type="search"
        name="q"
        placeholder={placeholder}
        defaultValue={query}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
      {query && (
        <a
          href="/dashboard/resources"
          aria-label="Clear resource search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </a>
      )}
    </form>
  );
}
