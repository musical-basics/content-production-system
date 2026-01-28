"use client"

import { cn } from "@/lib/utils"
import { FolderKanban, Library, Users, Settings, Play } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NewProjectDialog } from "./new-project-dialog"

const navItems = [
  { id: "projects", label: "Projects", icon: FolderKanban, href: "/" },
  { id: "assets", label: "Assets Library", icon: Library, href: "/assets" },
  { id: "team", label: "Team", icon: Users, href: "/team" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
            ContentOS
          </span>
        </div>
      </div>

      <div className="p-4 px-6 pb-0">
        <NewProjectDialog />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
