"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { useProjects } from "@/hooks/useProjects"
import { updateProjectStatus } from "@/lib/actions"
import type { Project } from "@/types"
import { Loader2 } from "lucide-react"

export default function ContentOS() {
  const { projects, loading } = useProjects()

  const handleProjectMoved = async (projectId: string, newStatus: Project["status"]) => {
    // Optimistic update could happen here, but useProjects is realtime so it might just bounce back.
    // For now, let's just trigger the action.
    await updateProjectStatus(projectId, newStatus)
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
