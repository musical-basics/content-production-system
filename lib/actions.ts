"use server"

import { supabase } from "@/lib/supabase"
import type { Project } from "@/types"
import { revalidatePath } from "next/cache"

export async function updateProjectStatus(id: string, newStatus: Project["status"]) {
    try {
        const { error } = await supabase
            .from("projects")
            .update({ status: newStatus })
            .eq("id", id)

        if (error) throw error

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error updating project status:", error)
        return { success: false, error }
    }
}

export async function createProject(title: string) {
    try {
        const { data, error } = await supabase
            .from("projects")
            .insert({
                title,
                status: "Scripting",
                folder_path: `/projects/${title.toLowerCase().replace(/\s+/g, "-")}`,
                // due_date: new Date().toISOString() // Optional default
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath("/")
        return { success: true, project: data }
    } catch (error) {
        console.error("Error creating project:", error)
        return { success: false, error }
    }
}
