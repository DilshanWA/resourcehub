
import Link from "next/link";
import { connection } from "next/server";
export const instant = false;
import { getResources } from "@/app/actions/resources";
import { getCurrentUser } from "@/lib/auth";
import { Pencil, Trash } from "lucide-react";


export default async function ResourcesPage() {
  await connection();

  const resources = await getResources()
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="mt-2 text-gray-600">
            View the resources available for reservation.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/resources/newresource`}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Resource
            </Link>
          </div>
        )}
      </div>

      {resources.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          No active resources found.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[50rem] text-left text-sm">
              <caption className="sr-only">Available resources</caption>
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Status
                  </th>
                   <th scope="col" className="px-6 py-4 font-semibold text-left">
                    Action
                  </th>
                   {user?.role === "ADMIN" && (
                     <th scope="col" className="px-6 py-4 font-semibold text-left">
                       Manage
                     </th>
                   )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-5 font-semibold text-gray-900"
                    >
                      {resource.name}
                    </th>
                    <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                      {resource.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                      {resource.location ?? "Not specified"}
                    </td>
                    <td className="max-w-sm px-6 py-5 text-gray-600">
                      {resource.description ?? "No description available."}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 text-left py-5">
                      <Link
                        href={`/dashboard/newreserve?resourceId=${resource.id}`}
                        className="inline-flex rounded-sm bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                      >
                        Reserve
                      </Link>
                    </td>
                    {user?.role === "ADMIN" && (
                      <td className="px-6 text-left py-5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/resources/${resource.id}/edit`}
                            aria-label={`Edit ${resource.name}`}
                            title="Edit resource"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button>
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
