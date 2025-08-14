"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/utils"

interface Ad {
  id: string
  title: string
  image_url: string
  screen_id: string
  created_at: string
}

export default function AdPreviewPage() {
  const params = useParams()
  const adId = params?.adId as string
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("adease_ads")
        .select("*")
        .eq("id", adId)
        .single()
      if (!error && data) {
        setAd(data)
      }
      setLoading(false)
    }

    if (adId) fetchAd()
  }, [adId])

  if (loading)
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white text-xl">
        Loading...
      </div>
    )

  if (!ad)
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-red-500 text-xl">
        Ad not found.
      </div>
    )

  return (
    <div className="fixed inset-0 m-0 p-0 w-screen h-screen bg-black overflow-hidden">
      <img
        src={ad.image_url || "/placeholder.svg"}
        alt={ad.title}
        className="w-full h-full object-contain md:object-contain"
      />
    </div>
  )
}
