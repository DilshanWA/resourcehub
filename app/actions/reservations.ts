"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ReservationState = {
  error?: string;
  success?: string;
};

function formValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function validateReservationInput(formData: FormData) {
  const resourceId = Number(formValue(formData, "resourceId"));
  const startTime = parseDate(formValue(formData, "startTime"));
  const endTime = parseDate(formValue(formData, "endTime"));
  const message = formValue(formData, "message");

  if (!Number.isInteger(resourceId) || resourceId < 1) {
    return { error: "Please select a valid resource." } as const;
  }
  if (!startTime || !endTime) {
    return { error: "Please enter a valid start and end time." } as const;
  }
  if (startTime <= new Date()) {
    return { error: "Reservations must start in the future." } as const;
  }
  if (endTime <= startTime) {
    return { error: "The end time must be after the start time." } as const;
  }
  if (endTime.getTime() - startTime.getTime() > 1000 * 60 * 60 * 24) {
    return { error: "Reservations cannot be longer than 24 hours." } as const;
  }
  if (message.length > 1000) {
    return { error: "The message cannot be longer than 1000 characters." } as const;
  }

  return { resourceId, startTime, endTime, message } as const;
}

export async function createReservation(
  _state: ReservationState | undefined,
  formData: FormData,
): Promise<ReservationState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const input = validateReservationInput(formData);
  if ("error" in input) {
    return input;
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const resource = await transaction.resource.findFirst({
          where: { id: input.resourceId, status: "ACTIVE" },
          select: { id: true },
        });

        if (!resource) {
          throw new Error("RESOURCE_NOT_AVAILABLE");
        }

        const overlap = await transaction.reservation.findFirst({
          where: {
            resourceId: input.resourceId,
            status: "CONFIRMED",
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
          },
          select: { id: true },
        });

        if (overlap) {
          throw new Error("RESERVATION_OVERLAP");
        }

        await transaction.reservation.create({
          data: {
            userId: user.id,
            resourceId: input.resourceId,
            startTime: input.startTime,
            endTime: input.endTime,
            message: input.message || null,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "RESOURCE_NOT_AVAILABLE") {
      return { error: "This resource is no longer available." };
    }
    if (error instanceof Error && error.message === "RESERVATION_OVERLAP") {
      return {
        error: "That resource is already reserved during the selected time.",
      };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return {
        error: "This resource was reserved by someone else. Please choose another time.",
      };
    }
    console.error("Failed to create reservation", error);
    return { error: "We could not create your reservation. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resources");
  revalidatePath("/dashboard/reservations");
  return { success: "Reservation confirmed successfully." };
}

export async function updateReservation(
  _state: ReservationState | undefined,
  formData: FormData,
): Promise<ReservationState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const reservationId = Number(formValue(formData, "reservationId"));
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    return { error: "Please select a valid reservation." };
  }

  const input = validateReservationInput(formData);
  if ("error" in input) {
    return input;
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const reservation = await transaction.reservation.findFirst({
          where: {
            id: reservationId,
            userId: user.id,
            status: "CONFIRMED",
          },
          select: { id: true, startTime: true },
        });

        if (!reservation) {
          throw new Error("RESERVATION_NOT_FOUND");
        }
        if (reservation.startTime <= new Date()) {
          throw new Error("RESERVATION_STARTED");
        }

        const resource = await transaction.resource.findFirst({
          where: { id: input.resourceId, status: "ACTIVE" },
          select: { id: true },
        });
        if (!resource) {
          throw new Error("RESOURCE_NOT_AVAILABLE");
        }

        const overlap = await transaction.reservation.findFirst({
          where: {
            resourceId: input.resourceId,
            status: "CONFIRMED",
            id: { not: reservationId },
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
          },
          select: { id: true },
        });
        if (overlap) {
          throw new Error("RESERVATION_OVERLAP");
        }

        await transaction.reservation.update({
          where: { id: reservation.id },
          data: {
            resourceId: input.resourceId,
            startTime: input.startTime,
            endTime: input.endTime,
            message: input.message || null,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "RESERVATION_NOT_FOUND") {
      return { error: "That reservation could not be found." };
    }
    if (error instanceof Error && error.message === "RESERVATION_STARTED") {
      return { error: "Reservations that have already started cannot be edited." };
    }
    if (error instanceof Error && error.message === "RESOURCE_NOT_AVAILABLE") {
      return { error: "This resource is no longer available." };
    }
    if (error instanceof Error && error.message === "RESERVATION_OVERLAP") {
      return { error: "That resource is already reserved during the selected time." };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return { error: "This reservation changed while you were editing it. Please try again." };
    }
    console.error("Failed to update reservation", error);
    return { error: "We could not update your reservation. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resources");
  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard/mybooking");
  return { success: "Reservation updated successfully." };
}

export async function cancelReservation(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const reservationId = Number(formValue(formData, "reservationId"));
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    redirect("/dashboard/reservations?error=invalid");
  }

  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, userId: user.id, status: "CONFIRMED" },
    select: { id: true, startTime: true },
  });

  if (!reservation) {
    redirect("/dashboard/reservations?error=not-found");
  }

  if (reservation.startTime <= new Date()) {
    redirect("/dashboard/reservations?error=started");
  }

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resources");
  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard/mybooking");
  redirect("/dashboard/reservations?success=cancelled");
}
