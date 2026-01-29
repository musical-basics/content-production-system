"use client"

import { use, useState, useEffect } from "react"
import { AssetGrid } from "@/components/asset-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Folder, Loader2 } from "lucide-react"
import Link from "next/link"
import { useProjects } from "@/hooks/useProjects"
import { useAssets } from "@/hooks/useAssets"
import type { Project } from "@/types"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    // We could fetch single project by ID, but since we have useProjects heavily cached/available,
    // we can just filter for now, OR better, make a useProject(id) hook. 
    // For Phase 5 "Swap", let's just use the list hook to find it or fetch it if needed.
    // Ideally: hooks/useProject.ts. But let's stick to useProjects().projects.find
    // actually, useProjects fetches ALL projects. It might be better to fetch one.
    // Let's implement a simple fetch-one effect here for simplicity without a new file.
    // OR re-use useProjects() but that feels wasteful if we only want one.
    // BUT, `useProjects` is already written to fetch all.
    // Let's try to find it in the list. If the list is empty (direct nav), we might need to fetch it.

    // Actually, to be robust, let's just fetch the single project in this component.

    const { assets, loading: assetsLoading } = useAssets(id)
    const [project, setProject] = useState<Project | null>(null)
    const [loadingProject, setLoadingProject] = useState(true)

    useEffect(() => {
        // Import supabase here to avoid top-level client issues if any (though standard import is fine)
        const fetchProject = async () => {
            const { supabase } = await import("@/lib/supabase")
            const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

            if (data) {
                setProject(data as Project)
            }
            setLoadingProject(false)
        }
        fetchProject()
    }, [id])


    if (loadingProject) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Left Panel: Metadata */}
            <div className="w-[400px] border-r border-border p-6 flex flex-col h-full bg-card">
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Board
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6 flex-1">
                    <div>
                        <Badge variant="outline" className="mb-3">{project.status}</Badge>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{project.title}</h1>
                        {project.description && (
                            <p className="text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center text-sm text-foreground">
                            <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                            <span>Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No Date"}</span>
                        </div>
                        <div className="flex items-center text-sm text-foreground">
                            <Folder className="w-4 h-4 mr-3 text-muted-foreground" />
                            <span className="truncate font-mono text-xs bg-muted px-2 py-1 rounded">{project.folder_path}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Asset Grid */}
            {assetsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <AssetGrid assets={assets} projectId={id} />
            )}
        </div>
    )
}
