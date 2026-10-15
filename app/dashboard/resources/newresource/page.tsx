import ResourcesForm from "@/app/components/ResourcesForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function NewResourcePage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/resources");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900">Create Resource</h1>
      <p className="mt-2 text-gray-600">
        Add a resource that users can reserve.
      </p>
      <ResourcesForm />
    </div>
  )
}
