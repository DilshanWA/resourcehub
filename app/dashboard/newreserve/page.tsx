import ReservationForm from "@/app/components/ReservationForm";
import { getResourceById, getResources } from "@/app/actions/resources";
import { connection } from "next/server";


type NewReservationPageProps = {
  searchParams: Promise<{ resourceId?: string | string[] }>;
};



export default async function NewReservationPage({searchParams}: NewReservationPageProps) {
  await connection();

  const query = await searchParams;
  const resourceIdValue = Array.isArray(query.resourceId)? query.resourceId[0]: query.resourceId;
  const resourceId = Number(resourceIdValue);
  const [resource, resources] = await Promise.all([
    Number.isInteger(resourceId) && resourceId > 0 ? getResourceById(resourceId) : null,
    getResources(),
  ]);
  if (!resource || resource.status !== "ACTIVE") {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Resource Details</h1>
        <p className="mt-2 text-red-600">
          The selected resource could not be found or is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl ">
      <h1 className="text-3xl font-bold text-gray-900">New Reservation</h1>
      <p className="mt-2 text-gray-600">
        Choose a time to reserve this resource.
      </p>
      <div>
        <ReservationForm resourceId={resource.id} resources={resources} />
      </div>
    </div>
  );
}
