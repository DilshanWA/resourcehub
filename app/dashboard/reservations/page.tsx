import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";

export default async function ReservationsPage({searchParams,}: {searchParams: Promise<{ error?: string; success?: string }>;}) {
  await connection();
  const params = await searchParams;
  const reservations = await prisma.reservation.findMany({
    include: {
      resource: { select: { name: true, type: true, location: true } },
      user: { select: { name: true } },
    },
    orderBy: { startTime: "desc" },
  });

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
    <div className="mx-auto max-w-[1500px]">
    <div>
    </div>
      <div className="mb-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="mt-2 text-gray-600">
              Review your upcoming bookings and manage them in one place.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/newreserve`} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Create New Reservation
            </Link>
          </div>
        </div>
        <hr className="border-gray-200 mt-4"></hr>
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

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No reservations yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Browse Resources to reserve a workspace or piece of equipment.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full max-w-full text-left text-sm">
              <caption className="sr-only">Your resource reservations</caption>
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Resource</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Organizer</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Location</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Discription</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Start</th>
                  <th scope="col" className="px-6 py-4 font-semibold">End</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((reservation) => {
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
                        {reservation.message ?? "Not specified"}
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
