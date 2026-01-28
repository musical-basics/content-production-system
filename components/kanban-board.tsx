"use client"

import { ProjectCard } from "./project-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Project } from "@/types"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

interface KanbanBoardProps {
  projects: Project[]
  // onSelectProject is no longer strictly needed for navigation but kept for potential other sidebar interactions? 
  // Let's make it optional or keep it but ProjectCard won't use it for main click.
  onSelectProject?: (project: Project) => void
  onProjectMoved?: (projectId: string, newStatus: Project["status"]) => void
}

const columns: Project["status"][] = ["Scripting", "Shooting", "Editing", "Review", "Published"]

const statusLabels: Record<string, string> = {
  Scripting: "Scripting",
  Shooting: "Shooting",
  Editing: "Editing",
  Review: "Review",
  Published: "Published",
}

const statusColors: Record<string, string> = {
  Scripting: "bg-amber-500/20 text-amber-400",
  Shooting: "bg-blue-500/20 text-blue-400",
  Editing: "bg-purple-500/20 text-purple-400",
  Review: "bg-orange-500/20 text-orange-400",
  Published: "bg-emerald-500/20 text-emerald-400",
}

export function KanbanBoard({ projects, onSelectProject, onProjectMoved }: KanbanBoardProps) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId as Project["status"]

    // Only trigger if status changed
    const project = projects.find(p => p.id === draggableId)
    if (project && project.status !== newStatus) {
      if (onProjectMoved) {
        onProjectMoved(draggableId, newStatus)
      } else {
        console.log(`Moved ${draggableId} to ${newStatus}`)
      }
    }
  }

  const getProjectsByStatus = (status: string) => {
    return projects.filter((p) => p.status === status)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length} active projects
            </p>
          </div>
        </div>

        <div className="flex gap-4 h-[calc(100vh-160px)] overflow-x-auto pb-4">
          {columns.map((status) => {
            const columnProjects = getProjectsByStatus(status)
            return (
              <div
                key={status}
                className="flex-shrink-0 w-72 flex flex-col bg-muted/30 rounded-xl"
              >
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[status]}`}
                      >
                        {statusLabels[status]}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {columnProjects.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={status}>
                  {(provided) => (
                    <ScrollArea
                      className="flex-1 p-3"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="space-y-3 min-h-[100px]">
                        {columnProjects.map((project, index) => (
                          <Draggable key={project.id} draggableId={project.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ProjectCard
                                  project={project}
                                // No longer passing onClick so Card handles navigation
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </div>
    </DragDropContext>
  )
}
