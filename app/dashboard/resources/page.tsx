
import Link from "next/link";
import { connection } from "next/server";
export const instant = false;
import { getResources } from "@/app/actions/resources";
import { deleteResource } from "@/app/actions/admin";
import { getCurrentUser,isAdmin } from "@/lib/auth";
import { Pencil, Trash } from "lucide-react";
import Search from "@/app/components/Search";
import ErrorModal from "@/app/components/ErrorModal";

export default async function ResourcesPage({searchParams,}: {searchParams: Promise<{ q?: string; error?: string }>}) {
  await connection();
  const user = await getCurrentUser();
  const userIsAdmin = isAdmin(user);

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const allResources = await getResources();
  const resources = query
    ? allResources.filter((resource) =>
        [resource.name, resource.type, resource.location, resource.description]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query.toLowerCase()))
      )
    : allResources;

  return (
    <div className="mx-auto max-w-7xl">
      <ErrorModal error={params.error} />
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">All Active Resources</h1>
          <p className="mt-2 text-slate-600">
            Browse rooms and equipment, then reserve what you need.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
          <Search query={query} />
          {userIsAdmin && (
            <Link
              href="/dashboard/resources/newresource"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add resource
            </Link>
          )}
        </div>
      </div>

      {query && (
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            {resources.length} {resources.length === 1 ? "resource" : "resources"} matching{" "}
            <span className="font-semibold text-slate-800">&quot;{query}&quot;</span>
          </p>
          <Link href="/dashboard/resources" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Clear search
          </Link>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {query ? "No matching resources" : "No active resources"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {query
              ? "Try a different name, type, location, or description."
              : "There are no resources available for reservation right now."}
          </p>
          {query && (
            <Link href="/dashboard/resources" className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
              View all resources
            </Link>
          )}
        </div>
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
                     Availability
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
                        className="inline-flex rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Reserve
                      </Link>
                    </td>
                    {userIsAdmin && (
                      <td className="px-6 text-left py-5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/resources/${resource.id}/edit`}
                            aria-label={`Edit ${resource.name}`}
                            title="Edit resource"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <form action={deleteResource}>
                            <input
                              type="hidden"
                              name="resourceId"
                              value={resource.id}
                            />
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-800"
                              aria-label={`Delete ${resource.name}`}
                              title="Delete resource"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </form>
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
