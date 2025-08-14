"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/utils"

interface Screen {
  id: string
  title: string
  location: string
  type: string
  is_active: boolean
}

interface Advertisement {
  title: string
  screenId: string
  imageUrl: string
}

interface AddAdvertisementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void // no argument, just triggers refresh
  screens: Screen[]
}

export default function AddAdvertisementModal({ isOpen, onClose, onSubmit, screens }: AddAdvertisementModalProps) {
  const [title, setTitle] = useState("")
  const [selectedScreen, setSelectedScreen] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find the selected screen object for display
  const selectedScreenObj = screens.find(s => s.id === selectedScreen)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    // Upload to Supabase
    const filePath = `ads/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('adease').upload(filePath, file)
    console.log(error)
    if (!error) {
      const { data } = supabase.storage.from('adease').getPublicUrl(filePath)
      setImageUrl(data.publicUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Insert into Supabase
    const { error } = await supabase.from('adease_ads').insert([
      {
        title,
        screen_id: selectedScreen,
        image_url: imageUrl,
      }
    ])
    console.log(error)
    if (!error) {
      setTitle("")
      setSelectedScreen("")
      setImageFile(null)
      setImageUrl("")
      setIsSubmitting(false)
      onSubmit() // trigger parent to refresh ads
    } else {
      setIsSubmitting(false)
      // Optionally show error
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("")
      setSelectedScreen("")
      setImageFile(null)
      setImageUrl("")
      onClose()
    }
  }
  console.log(screens)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* <DialogHeader>
          <DialogTitle>Add New Advertisement</DialogTitle>
          <DialogDescription>Create a new advertisement to display on your selected screen.</DialogDescription>
        </DialogHeader> */}

        {screens.length === 0 ? (
          <div className="text-center p-6">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No screens available</h3>
            <p className="mt-2 text-gray-500">You need to add at least one screen before creating advertisements.</p>
            {/* <Button asChild className="mt-4 bg-[#ED7614] hover:bg-orange-500 cursor-pointer" onClick={handleClose} >
              <a href="/dashboard/screens">Add Screen</a>
            </Button> */}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Advertisement Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this advertisement"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screen">Select Screen</Label>
                <Select value={selectedScreen} onValueChange={setSelectedScreen} required>
                  <SelectTrigger id="screen">
                    <SelectValue placeholder="Select a screen" />
                  </SelectTrigger>
                  <SelectContent>
                    {screens.map((screen) => (
                      <SelectItem key={screen.id} value={screen.title}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${screen.is_active ? "bg-green-500" : "bg-red-500"}`} />
                          <span>{screen.title}</span>
                          <span className="text-xs text-gray-500">({screen.location})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Advertisement Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-gray-500">Pick an image to upload</p>
                <div className="mt-4 border rounded-md p-4">
                  <p className="text-sm font-medium mb-2">Image Preview</p>
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg?height=300&width=500"}
                      alt="Advertisement preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Advertisement"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
