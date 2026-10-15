import ResourcesForm from "@/app/components/ResourcesForm";
import { getResourceById } from "@/app/actions/resources";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/resources");
  }

  const resourceId = Number((await params).id);
  if (!Number.isInteger(resourceId) || resourceId < 1) {
    notFound();
  }

  const resource = await getResourceById(resourceId);
  if (!resource) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
      <p className="mt-2 text-gray-600">Update the details of this resource.</p>
      <ResourcesForm
        resourceId={resource.id}
        initialName={resource.name}
        initialType={resource.type}
        initialLocation={resource.location ?? ""}
        initialDescription={resource.description ?? ""}
      />
    </div>
  )
}
