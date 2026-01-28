export interface Project {
  id: string
  title: string
  thumbnail: string
  dueDate: string
  status: ProjectStatus
  description: string
  deliverables: Deliverable[]
  assets: Asset[]
}

export type ProjectStatus = "scripting" | "shooting" | "editing" | "review" | "published"

export interface Deliverable {
  id: string
  platform: "youtube" | "tiktok" | "blog"
  title: string
  completed: boolean
}

export interface Asset {
  id: string
  filename: string
  duration: string
  thumbnail: string
  size: string
}

export const statusLabels: Record<ProjectStatus, string> = {
  scripting: "Scripting",
  shooting: "Shooting",
  editing: "Editing",
  review: "Review",
  published: "Published",
}

export const statusColors: Record<ProjectStatus, string> = {
  scripting: "bg-amber-500/20 text-amber-400",
  shooting: "bg-blue-500/20 text-blue-400",
  editing: "bg-purple-500/20 text-purple-400",
  review: "bg-orange-500/20 text-orange-400",
  published: "bg-emerald-500/20 text-emerald-400",
}
