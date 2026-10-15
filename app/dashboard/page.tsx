import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarPlus,
  Clock3,
  MapPin,
  PackageOpen,
  Sparkles,
} from "lucide-react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export default async function DashboardPage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const now = new Date();
  const [resources, upcomingReservations, bookingCount] = await Promise.all([
    prisma.resource.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, type: true, location: true },
    }),
    prisma.reservation.findMany({
      where: {
        userId: user.id,
        status: "CONFIRMED",
        endTime: { gt: now },
      },
      orderBy: { startTime: "asc" },
      take: 3,
      include: {
        resource: { select: { name: true, location: true } },
      },
    }),
    prisma.reservation.count({ where: { userId: user.id } }),
  ]);

  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
              Your workspace, simplified
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Keep your day moving with quick access to shared rooms, equipment,
              and your upcoming reservations.
            </p>
          </div>
          <Link
            href="/dashboard/resources"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <CalendarPlus className="h-4 w-4" />
            Browse resources
          </Link>
        </div>
      </section>

      <section aria-label="Your booking summary" className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<CalendarCheck2 className="h-5 w-5" />}
          label="Upcoming bookings"
          value={upcomingReservations.length}
          detail={upcomingReservations.length === 1 ? "Ready for your next booking" : "Confirmed in your schedule"}
          tone="indigo"
        />
        <StatCard
          icon={<PackageOpen className="h-5 w-5" />}
          label="Available resources"
          value={resources.length}
          detail="Rooms and equipment you can reserve"
          tone="cyan"
        />
        <StatCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Total reservations"
          value={bookingCount}
          detail="Your reservation history"
          tone="amber"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-950">Upcoming reservations</h2>
              <p className="mt-1 text-sm text-slate-500">Your next scheduled bookings</p>
            </div>
            <Link
              href="/dashboard/mybooking"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {upcomingReservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CalendarPlus className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Nothing booked yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Find a resource that fits your day and reserve it in a few clicks.
              </p>
              <Link
                href="/dashboard/resources"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Browse resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex gap-4 px-6 py-5">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <span className="text-[10px] font-bold uppercase">
                      {reservation.startTime.toLocaleDateString("en", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold leading-4">{reservation.startTime.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">{reservation.resource.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {dateFormatter.format(reservation.startTime)} · {timeFormatter.format(reservation.startTime)}–{timeFormatter.format(reservation.endTime)}
                    </p>
                    {reservation.resource.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {reservation.resource.location}
                      </p>
                    )}
                  </div>
                  <span className="hidden self-start rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-950">Explore resources</h2>
              <p className="mt-1 text-sm text-slate-500">Available for your next plan</p>
            </div>
            <Link href="/dashboard/resources" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
              See all
            </Link>
          </div>
          <div className="p-4">
            {resources.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-slate-500">No active resources are available right now.</p>
            ) : (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/dashboard/newreserve?resourceId=${resource.id}`}
                    className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <PackageOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{resource.name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {resource.type}{resource.location ? ` · ${resource.location}` : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  tone: "indigo" | "cyan" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    cyan: "bg-cyan-50 text-cyan-700",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
        <span className="text-3xl font-bold tracking-tight text-slate-950">{value}</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
