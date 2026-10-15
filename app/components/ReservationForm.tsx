"use client";

import { useActionState, useState } from "react";
import {
  createReservation,
  updateReservation,
  type ReservationState,
} from "@/app/actions/reservations";

type ReservationResource = {
  id: number;
  name: string;
  type: string;
  location: string | null;
  description: string | null;
};

type ReservationFormProps = {
  resourceId: number;
  resources: ReservationResource[];
  reservationId?: number;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  initialMessage?: string;
};

const initialState: ReservationState = {};

export default function ReservationForm({
  resourceId,
  resources,
  reservationId,
  initialDate = "",
  initialStartTime = "",
  initialEndTime = "",
  initialMessage = "",
}: ReservationFormProps) {
  const [state, action, pending] = useActionState(
    reservationId ? updateReservation : createReservation,
    initialState,
  );
  const [selectedResourceId, setSelectedResourceId] = useState(String(resourceId));
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const selectedResource =
    resources.find((resource) => resource.id === Number(selectedResourceId)) ??
    resources.find((resource) => resource.id === resourceId);

  function submitReservation(formData: FormData) {
    formData.set("resourceId", selectedResourceId);
    formData.set("startTime", `${formData.get("date")}T${formData.get("startClock")}`);
    formData.set("endTime", `${formData.get("date")}T${formData.get("endClock")}`);
    if (reservationId) {
      formData.set("reservationId", String(reservationId));
    }
    action(formData);
  }

  return (
    <div className="mt-6 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form
        action={submitReservation}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="resourceId" className="mb-2 block text-sm font-semibold text-slate-700">
            Resource
          </label>
          <select
            id="resourceId"
            name="resourceId"
            value={selectedResourceId}
            onChange={(event) => setSelectedResourceId(event.target.value)}
            required
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startClock" className="mb-2 block text-sm font-semibold text-slate-700">
              Start time
            </label>
            <input
              id="startClock"
              name="startClock"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label htmlFor="endClock" className="mb-2 block text-sm font-semibold text-slate-700">
              End time
            </label>
            <input
              id="endClock"
              name="endClock"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
            Message <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={1000}
            placeholder="Add a note about this reservation..."
            defaultValue={initialMessage}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {state.error && (
          <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending
            ? reservationId
              ? "Saving..."
              : "Reserving..."
            : reservationId
              ? "Save changes"
              : "Reserve resource"}
        </button>
      </form>

      {selectedResource && (
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{selectedResource.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedResource.type} · {selectedResource.location ?? "Location not specified"}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {selectedResource.description ?? "No description available."}
          </p>
        </aside>
      )}
    </div>
  );
}
