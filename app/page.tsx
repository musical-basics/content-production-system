"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { useProjects } from "@/hooks/useProjects"
import { updateProjectStatus } from "@/lib/actions"
import type { Project } from "@/types"
import { Loader2 } from "lucide-react"

import { toast } from "sonner"

export default function ContentOS() {
  const { projects, loading, setProjects } = useProjects()

  const handleProjectMoved = async (projectId: string, newStatus: Project["status"]) => {
    // 1. Optimistic Update
    const previousProjects = [...projects]
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p))

    // 2. Server Action
    const result = await updateProjectStatus(projectId, newStatus)

    // 3. Rollback if failed
    if (!result.success) {
      setProjects(previousProjects)
      toast.error("Failed to move project")
    }
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-background">
      <KanbanBoard
        projects={projects}
        onProjectMoved={handleProjectMoved}
      />
    </div>
  )
}
