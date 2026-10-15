import { cancelReservation } from "@/app/actions/reservations";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Search from "@/app/components/Search";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; q?: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const reservations = await prisma.reservation.findMany({
    where: {
      userId: user.id,
      ...(query
        ? {
            OR: [
              { resource: { name: { contains: query, mode: "insensitive" } } },
              { resource: { type: { contains: query, mode: "insensitive" } } },
              { resource: { location: { contains: query, mode: "insensitive" } } },
              { message: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      resource: { select: { name: true, type: true, location: true } },
      user: { select: { name: true } },
    },
    orderBy: { startTime: "desc" },
  });
  const now = new Date();

  const message =
    params.success === "cancelled"
      ? { type: "success", text: "Your reservation was cancelled successfully." }
      : params.error === "started"
        ? { type: "error", text: "Reservations that have already started cannot be cancelled." }
        : params.error === "not-found"
          ? { type: "error", text: "That reservation could not be found." }
          : params.error === "invalid"
            ? { type: "error", text: "Please select a valid reservation." }
            : null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">My bookings</h1>
          <p className="mt-2 text-gray-600">
            Review upcoming bookings, update details, or cancel when plans change.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Search
            action="/dashboard/mybooking"
            query={query}
            placeholder="Search my bookings"
            ariaLabel="Search my bookings"
          />
        </div>
      </div>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {query && (
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            {reservations.length} {reservations.length === 1 ? "booking" : "bookings"} matching{" "}
            <span className="font-semibold text-slate-800">&quot;{query}&quot;</span>
          </p>
          <Link href="/dashboard/mybooking" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Clear search
          </Link>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {query ? "No matching bookings" : "No bookings yet"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {query
              ? "Try a different resource, location, or message."
              : "Browse the resource library to reserve a workspace or piece of equipment."}
          </p>
          <Link href="/dashboard/resources" className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            Browse resources
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full max-w-9xl text-left text-sm">
              <caption className="sr-only">Your resource reservations</caption>
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Resource</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Organizer</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Location</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Start</th>
                  <th scope="col" className="px-6 py-4 font-semibold">End</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((reservation) => {
                  const canCancel =
                    reservation.status === "CONFIRMED" &&
                    reservation.startTime > now;
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <th scope="row" className="whitespace-nowrap px-6 py-5 font-semibold text-gray-900">
                        <span className="block">{reservation.resource.name}</span>
                        <span className="mt-1 block text-xs font-normal text-gray-500">
                          {reservation.resource.type}
                        </span>
                      </th>
                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        {reservation.user.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        {reservation.resource.location ?? "Not specified"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        {reservation.startTime.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        {reservation.endTime.toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          reservation.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {reservation.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {canCancel ? (
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/dashboard/mybooking/${reservation.id}/edit`}
                              className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </Link>
                            <form action={cancelReservation}>
                              <input type="hidden" name="reservationId" value={reservation.id} />
                              <button type="submit" className="font-semibold text-red-600 hover:text-red-800">
                                Cancel
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            {reservation.status === "CANCELLED" ? "No action" : "In progress"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
