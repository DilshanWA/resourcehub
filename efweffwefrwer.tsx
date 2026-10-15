"use client";

import { useActionState } from "react";
import { createReservation, type ReservationState } from "@/app/actions/reservations";

const initialState: ReservationState = {};

export default function ReservationForm({ resourceId }: { resourceId: number }) {
  const [state, action, pending] = useActionState(createReservation, initialState);

  return (
    <form action={action} className="mt-6 border-t border-gray-100 pt-5">
      <input type="hidden" name="resourceId" value={resourceId} />
      <h3 className="text-sm font-semibold text-gray-900">Reserve this resource</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-gray-600">
          Start time
          <input
            required
            type="datetime-local"
            name="startTime"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="text-xs font-medium text-gray-600">
          End time
          <input
            required
            type="datetime-local"
            name="endTime"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>
      {state.error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.success}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Checking availability..." : "Reserve resource"}
      </button>
    </form>
  );
}
