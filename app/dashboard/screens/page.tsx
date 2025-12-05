"use client"

import { useState, useEffect } from "react"
import { Monitor, Plus, Power, PowerOff, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import AddScreenModal from "@/components/add-screen-modal"
import { supabase } from "@/lib/utils"

interface Screen {
  id: string
  is_active: any
  title: string
  location: string
  type: string
  created_at: string
}

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch screens from Supabase
  useEffect(() => {
    const fetchScreens = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('adease_screens')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error("Failed to fetch screens:", error.message)
        alert("Failed to load screens. Please refresh the page.")
      } else if (data) {
        setScreens(data as Screen[])
      }
      setLoading(false)
    }
    fetchScreens()
  }, [])

  // Add screen handler
  const handleAddScreen = async (screen: Omit<Screen, 'id' | 'created_at'>) => {
    setLoading(true)
    const { error } = await supabase.from('adease_screens').insert([screen])
    if (error) {
      console.error("Failed to add screen:", error.message)
      alert("Failed to add screen. Please try again.")
      setLoading(false)
      return
    }
    // Refresh list
    const { data } = await supabase
      .from('adease_screens')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setScreens(data as Screen[])
      setIsModalOpen(false)
    }
    setLoading(false)
  }

  // Toggle status handler
  const toggleScreenStatus = async (screenId: string) => {
    const screen = screens.find(s => s.id === screenId)
    if (!screen) return
    setLoading(true)
    const { error } = await supabase.from('adease_screens').update({ is_active: !screen.is_active }).eq('id', screenId)
    if (error) {
      console.error("Failed to update screen status:", error.message)
      alert("Failed to update screen status. Please try again.")
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('adease_screens')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setScreens(data as Screen[])
    }
    setLoading(false)
  }

  // Delete handler
  const deleteScreen = async (screenId: string) => {
    if (!confirm("Are you sure you want to delete this screen?")) {
      return
    }
    setLoading(true)
    const { error } = await supabase.from('adease_screens').delete().eq('id', screenId)
    if (error) {
      console.error("Failed to delete screen:", error.message)
      alert("Failed to delete screen. Please try again.")
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('adease_screens')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setScreens(data as Screen[])
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Screens</h1>
          <p className="text-gray-600 mt-1">Manage your digital screens and their status</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2  bg-[#ED7614] hover:bg-orange-500 cursor-pointer ">
          <Plus size={16} />
          Add Screen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor size={20} />
            All Screens ({screens.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Monitor className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Loading screens...</h3>
              <p className="mt-2 text-gray-500">Please wait while we fetch the screens.</p>
            </div>
          ) : screens.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No screens added yet</h3>
              <p className="mt-2 text-gray-500">Get started by adding your first screen.</p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4  bg-[#ED7614] hover:bg-orange-500 cursor-pointer">
                <Plus size={16} className="mr-2 " />
                Add Your First Screen
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screens.map((screen) => (
                  <TableRow key={screen.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {screen.is_active ? (
                          <Power className="h-4 w-4 text-green-600" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={screen.is_active ? "default" : "secondary"}>
                          {screen.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{screen.title}</TableCell>
                    <TableCell className="font-mono text-sm">{screen.location}</TableCell>
                    <TableCell className="font-mono text-sm">{screen.type}</TableCell>
                    <TableCell className="text-gray-500">{formatDate(screen.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleScreenStatus(screen.id)}
                          className="flex items-center gap-1"
                        >
                          {screen.is_active ? (
                            <>
                              <PowerOff size={14} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power size={14} />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteScreen(screen.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddScreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddScreen} />
    </div>
  )
}
