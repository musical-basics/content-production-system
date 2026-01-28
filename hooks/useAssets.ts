"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Asset } from "@/types"

export function useAssets(projectId: string) {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!projectId) return

        async function fetchAssets() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("assets")
                    .select("*")
                    .eq("project_id", projectId)
                    .order("created_at", { ascending: false })

                if (error) {
                    throw error
                }

                if (data) {
                    setAssets(data as Asset[])
                }
            } catch (err) {
                console.error("Error fetching assets:", err)
                setError("Failed to fetch assets")
            } finally {
                setLoading(false)
            }
        }

        fetchAssets()

        // Realtime subscription
        const channel = supabase
            .channel(`assets_channel_${projectId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'assets', filter: `project_id=eq.${projectId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setAssets((prev) => [payload.new as Asset, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setAssets((prev) => prev.map(a => a.id === payload.new.id ? (payload.new as Asset) : a))
                    } else if (payload.eventType === 'DELETE') {
                        setAssets((prev) => prev.filter(a => a.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [projectId])

    return { assets, loading, error }
}
