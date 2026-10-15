"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getResources() {
  const resources = await prisma.resource.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
    return resources;
}

export async function getResourceById(resourceId: number) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });
  return resource;
}

export type ResourceState = {
  error?: string;
};

function formValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateResourceInput(formData: FormData) {
  const name = formValue(formData, "name");
  const type = formValue(formData, "type");
  const location = formValue(formData, "location");
  const description = formValue(formData, "description");

  if (!name) {
    return { error: "Please enter a resource name." } as const;
  }
  if (name.length > 150) {
    return { error: "The resource name cannot be longer than 150 characters." } as const;
  }
  if (!type) {
    return { error: "Please enter a resource type." } as const;
  }
  if (type.length > 100) {
    return { error: "The resource type cannot be longer than 100 characters." } as const;
  }
  if (location.length > 255) {
    return { error: "The location cannot be longer than 255 characters." } as const;
  }
  if (description.length > 5000) {
    return { error: "The description cannot be longer than 5000 characters." } as const;
  }

  return {
    name,
    type,
    location: location || null,
    description: description || null,
  } as const;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/resources");
  }
}

export async function createResource(
  _state: ResourceState | undefined,
  formData: FormData,
): Promise<ResourceState> {
  await requireAdmin();

  const input = validateResourceInput(formData);
  if ("error" in input) {
    return input;
  }

  try {
    await prisma.resource.create({ data: input });
  } catch (error) {
    console.error("Failed to create resource", error);
    return { error: "We could not create the resource. Please try again." };
  }

  revalidatePath("/dashboard/resources");
  redirect("/dashboard/resources");
}

export async function updateResource(
  _state: ResourceState | undefined,
  formData: FormData,
): Promise<ResourceState> {
  await requireAdmin();

  const resourceId = Number(formValue(formData, "resourceId"));
  if (!Number.isInteger(resourceId) || resourceId < 1) {
    return { error: "Please select a valid resource." };
  }

  const input = validateResourceInput(formData);
  if ("error" in input) {
    return input;
  }

  try {
    const result = await prisma.resource.updateMany({
      where: { id: resourceId },
      data: input,
    });

    if (result.count === 0) {
      return { error: "That resource could not be found." };
    }
  } catch (error) {
    console.error("Failed to update resource", error);
    return { error: "We could not update the resource. Please try again." };
  }

  revalidatePath("/dashboard/resources");
  revalidatePath(`/dashboard/resources/${resourceId}/edit`);
  redirect("/dashboard/resources");
}