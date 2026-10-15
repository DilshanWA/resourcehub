import Link from "next/link";
import { connection } from "next/server";
import Search from "@/app/components/Search";
import { getAllUsers } from "@/app/actions/admin";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connection();

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const allUsers = await getAllUsers();
  const normalizedQuery = query.toLowerCase();
  const users = normalizedQuery
    ? allUsers.filter((user) =>
        [user.name, user.email, user.role].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      )
    : allUsers;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Users
          </h1>
          <p className="mt-2 text-slate-600">
            Manage the people who can access ResourceHub.
          </p>
        </div>
        <Search
          action="/dashboard/users"
          query={query}
          placeholder="Search users"
          ariaLabel="Search users"
        />
      </div>

      {query && (
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            {users.length} {users.length === 1 ? "user" : "users"} matching{" "}
            <span className="font-semibold text-slate-800">&quot;{query}&quot;</span>
          </p>
          <Link
            href="/dashboard/users"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Clear search
          </Link>
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {query ? "No matching users" : "No users yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {query
              ? "Try a different name, email address, or role."
              : "Registered users will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">ResourceHub users</caption>
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-5 font-semibold text-gray-900"
                    >
                      {user.name}
                    </th>
                    <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                      {user.createdAt.toLocaleDateString()}
                    </td>
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
