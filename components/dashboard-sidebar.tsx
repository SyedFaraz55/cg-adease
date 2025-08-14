"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Monitor, ImageIcon, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Screens",
    href: "/dashboard/screens",
    icon: Monitor,
  },
  {
    name: "Advertisements",
    href: "/dashboard/advertisements",
    icon: ImageIcon,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
      <Image src="/logo.svg" alt="Logo" className="mx-auto mb-2 h-14 w-auto" width={500} height={500} />
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn("mr-3 h-5 w-5", isActive ? "text-gray-700" : "text-gray-400 group-hover:text-gray-500")}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
        onClick={() => {
          localStorage.removeItem("@session_id");
          window.location.href = '/'
        }}
         className="bg-white text-black hover:bg-white text-black"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
