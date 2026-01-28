"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectMetadata } from "./project-metadata"
import { AssetsPanel } from "./assets-panel"
import type { Project } from "@/lib/types"
import type { ReactNode } from "react"

interface ProjectDetailViewProps {
  project: Project
  onBack: () => void
  onUpdate: (updates: Partial<Project>) => void
  /**
   * Optional custom right panel component.
   * If not provided, defaults to AssetsPanel.
   * This prop allows swapping the assets panel with other views like AI Chat.
   */
  rightPanel?: ReactNode
}

export function ProjectDetailView({
  project,
  onBack,
  onUpdate,
  rightPanel,
}: ProjectDetailViewProps) {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium text-foreground truncate">
            {project.title}
          </h1>
        </div>
      </header>

      {/* Split View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Metadata */}
        <div className="w-[400px] border-r border-border bg-background overflow-hidden flex-shrink-0">
          <ProjectMetadata project={project} onUpdate={onUpdate} />
        </div>

        {/* Right Panel - Swappable (Assets by default) */}
        <div className="flex-1 bg-muted/20 overflow-hidden">
          {rightPanel ?? <AssetsPanel assets={project.assets} />}
        </div>
      </div>
    </div>
  )
}
