import Sidebar from "@/app/components/Sidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import Header from "@/app/components/Header"

export const instant = false

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await connection()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 md:ml-64 text-black">
        <Header user={user} />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
