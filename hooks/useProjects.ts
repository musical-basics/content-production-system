"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/types"

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProjects() {
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (error) {
                    throw error
                }

                if (data) {
                    setProjects(data as Project[])
                }
            } catch (err) {
                console.error("Error fetching projects:", err)
                setError("Failed to fetch projects")
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()

        // Realtime subscription
        const channel = supabase
            .channel('projects_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                (payload) => {
                    console.log('Realtime Event:', payload)
                    if (payload.eventType === 'INSERT') {
                        setProjects((prev) => [...prev, payload.new as Project])
                    } else if (payload.eventType === 'UPDATE') {
                        setProjects((prev) => prev.map(p => p.id === payload.new.id ? (payload.new as Project) : p))
                    } else if (payload.eventType === 'DELETE') {
                        setProjects((prev) => prev.filter(p => p.id !== payload.old.id))
                    }
                }
            )
            .subscribe((status) => {
                console.log("Realtime Subscription Status:", status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { projects, loading, error, setProjects }
}
