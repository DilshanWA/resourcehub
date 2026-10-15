import ReservationForm from "@/app/components/ReservationForm";
import { getResources } from "@/app/actions/resources";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

export default async function EditReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const reservationId = Number((await params).id);
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    notFound();
  }

  const [reservation, resources] = await Promise.all([
    prisma.reservation.findFirst({
      where: { id: reservationId, userId: user.id, status: "CONFIRMED" },
      select: {
        id: true,
        resourceId: true,
        startTime: true,
        endTime: true,
        message: true,
      },
    }),
    getResources(),
  ]);

  if (!reservation || reservation.startTime <= new Date()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900">Edit Reservation</h1>
      <p className="mt-2 text-gray-600">Update the details of your reservation.</p>
      <ReservationForm
        resourceId={reservation.resourceId}
        resources={resources}
        reservationId={reservation.id}
        initialDate={reservation.startTime.toISOString().slice(0, 10)}
        initialStartTime={reservation.startTime.toISOString().slice(11, 16)}
        initialEndTime={reservation.endTime.toISOString().slice(11, 16)}
        initialMessage={reservation.message ?? ""}
      />
    </div>
  );
}
