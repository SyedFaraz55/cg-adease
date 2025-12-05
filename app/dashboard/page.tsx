"use client"

import { useState, useEffect } from "react"
import { Monitor, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabase } from "@/lib/utils"

// This would come from a database in a real application
interface Screen {
  id: string
  macAddress: string
  title: string
  createdAt: string
  created_at?:string,
  isActive: boolean
  is_active?:boolean
}

export default function Dashboard() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {

    const fetchScreens = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('adease_screens')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error("Failed to fetch screens:", error.message)
      } else if (data) {
        setScreens(data)
      }
      setLoading(false)
    }
    fetchScreens()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screens</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screens.length}</div>
            <p className="text-xs text-muted-foreground">
              {screens.filter((s) => s.is_active).length} active, {screens.filter((s) => !s.is_active).length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Screens</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screens.filter((s) => s.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Currently displaying content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground " />
          </CardHeader>
          <CardContent className="space-y-2 ">
            <Button asChild size="sm" className="w-full bg-[#ED7614] hover:bg-orange-500 cursor-pointer">
              <Link href="/dashboard/screens">
                <Monitor className="mr-2 h-4 w-4 " />
                Manage Screens 
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/advertisements">
                <Plus className="mr-2 h-4 w-4" />
                Add Advertisement
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {screens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Screens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screens.slice(0, 5).map((screen) => (
                <div key={screen.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {screen.is_active ? (
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{screen.title}</p>
                      <p className="text-sm text-gray-500">{screen.location}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(screen.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
            {screens.length > 5 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/screens">View All Screens</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
