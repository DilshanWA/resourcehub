"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteResource(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/resources?error=unauthorized");
  }

  const resourceIdValue = formData.get("resourceId");
  const resourceId =
    typeof resourceIdValue === "string" ? Number(resourceIdValue) : NaN;
  if (!Number.isInteger(resourceId) || resourceId < 1) {
    redirect("/dashboard/resources?error=invalid-resource");
  }

  const result = await prisma.resource.updateMany({
    where: { id: resourceId, status: "ACTIVE" },
    data: { status: "INACTIVE" },
  });

  if (result.count === 0) {
    redirect("/dashboard/resources?error=not-found");
  }

  revalidatePath("/dashboard/resources");
  revalidatePath("/dashboard/newreserve");
  redirect("/dashboard/resources");
}