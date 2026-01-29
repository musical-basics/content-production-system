"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Asset } from "@/types"

export function useAssets(projectId?: string) {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchAssets() {
            try {
                setLoading(true)
                let query = supabase
                    .from("assets")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (projectId) {
                    query = query.eq("project_id", projectId)
                }

                const { data, error } = await query

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
        const channelName = projectId ? `assets_channel_${projectId}` : 'assets_channel_all'
        const filter = projectId ? `project_id=eq.${projectId}` : undefined

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'assets', filter },
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
