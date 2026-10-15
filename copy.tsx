
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  Users,
  CheckCircle2,
  Monitor,
  X,
} from "lucide-react";

const resources = [
  {
    name: "Meeting Room A",
    floor: "First Floor",
    capacity: 8,
    description:
      "Room for team meetings. Comes with a projector and video conferencing system.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Conference Room B",
    floor: "Second Floor",
    capacity: 12,
    description:
      "A spacious conference room for presentations and collaborative sessions.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Focus Room C",
    floor: "First Floor",
    capacity: 4,
    description:
      "A quiet, comfortable space for focused work and small discussions.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85",
  },
];

export default function NewReservationPage() {
  const [resource, setResource] = useState("Meeting Room A");
  const [date, setDate] = useState("2025-04-22");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [reserved, setReserved] = useState(false);

  const selectedRoom =
    resources.find((room) => room.name === resource) ?? resources[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (endTime <= startTime) {
      setMessage("End time must be later than start time.");
      setReserved(false);
      return;
    }

    setMessage(
      `Your reservation for ${selectedRoom.name} has been submitted.`
    );
    setReserved(true);
  }

  return (
    <main className="min-h-screen bg-[#f8faff] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={15} />
          Back to Resources
        </button>

        {/* Page heading */}
        <header className="mb-6">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
            New Reservation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a resource and choose your preferred time slot.
          </p>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
          {/* Reservation form */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.025)] sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Resource */}
              <div>
                <label
                  htmlFor="resource"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Resource
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
                  />
                  <select
                    id="resource"
                    value={resource}
                    onChange={(e) => {
                      setResource(e.target.value);
                      setReserved(false);
                      setMessage("");
                    }}
                    className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    {resources.map((room) => (
                      <option key={room.name} value={room.name}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setReserved(false);
                      setMessage("");
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Start and end time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-xs font-semibold text-slate-600"
                  >
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      id="startTime"
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setReserved(false);
                        setMessage("");
                      }}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                    <Clock3
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 bg-white text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-xs font-semibold text-slate-600"
                  >
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      id="endTime"
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        setReserved(false);
                        setMessage("");
                      }}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                    <Clock3
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 bg-white text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label
                  htmlFor="purpose"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Purpose{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="purpose"
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Team meeting, project discussion..."
                  className="min-h-[100px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Feedback */}
              {message && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                    reserved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {reserved && (
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  )}
                  <span>{message}</span>
                  <button
                    type="button"
                    aria-label="Dismiss message"
                    onClick={() => setMessage("")}
                    className="ml-auto shrink-0 opacity-70 hover:opacity-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-lg bg-[#4361f5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3451e8] focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99]"
              >
                {reserved ? "Reserve Another Time" : "Reserve"}
              </button>
            </form>
          </section>

          {/* Resource details card */}
          <aside className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.025)] sm:p-5">
            <div className="overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.name}
                width={900}
                height={600}
                className="h-[180px] w-full object-cover sm:h-[190px]"
              />
            </div>

            <div className="pt-4">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {selectedRoom.name}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-pink-50 px-3 py-1 text-[11px] font-medium text-pink-700">
                  Meeting Room
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                  {selectedRoom.floor}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {selectedRoom.description}
              </p>

              <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                {/* Capacity */}
                <div className="flex items-start gap-3">
                  <Users
                    size={17}
                    className="mt-0.5 text-slate-500"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Capacity
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedRoom.capacity} people
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 text-emerald-600"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Availability
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Yes
                    </p>
                  </div>
                </div>

                {/* Equipment */}
                <div className="flex items-start gap-3">
                  <Monitor
                    size={17}
                    className="mt-0.5 text-slate-500"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Equipment
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      Projector & video conferencing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Workspace Reservations
        </footer>
      </div>
    </main>
  );
}
