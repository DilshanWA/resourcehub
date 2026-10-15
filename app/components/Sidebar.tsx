import Link from 'next/link'
import { signOut } from "@/app/actions/auth"
import { House, NotebookText,CalendarClock, SquareBookmark } from 'lucide-react';

const navigations = [
  { name: 'Dashboard', href: '/dashboard', icon: House },
  { name: 'Reservations', href: '/dashboard/reservations', icon: NotebookText },
  { name: 'Resources', href: '/dashboard/resources', icon: CalendarClock },
  { name: 'My Bookings', href: '/dashboard/mybooking', icon: SquareBookmark }
]

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-800 justify-between">
      <div className="flex flex-col">
        <div className="flex-shrink-0 p-4">
          <h1 className="text-xl font-bold text-white">ResourceHub</h1>
        </div>
        <nav className="flex-1 space-y-5 px-2 py-10">
          {navigations.map((item) => {
            const ItemIcon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium"
              >
                {ItemIcon && <ItemIcon className="mr-3 h-5 w-5" />}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <form action={signOut} className="p-4">
          <button type="submit" className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Sign out
          </button>
        </form>
    </div>
  )
}
