"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import type { Project } from "@/types"
import { revalidatePath } from "next/cache"

export async function updateProjectStatus(id: string, newStatus: Project["status"]) {
    try {
        const { error } = await supabaseAdmin
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
        const { data, error } = await supabaseAdmin
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

export async function uploadAsset(projectId: string, formData: FormData) {
    try {
        const file = formData.get("file") as File
        if (!file) {
            return { success: false, error: "No file provided" }
        }

        const filename = file.name
        const fileType = filename.split(".").pop()?.toLowerCase() || "unknown"
        const sizeBytes = file.size
        const storagePath = `${projectId}/${Date.now()}-${filename}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("project-assets")
            .upload(storagePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from("project-assets")
            .getPublicUrl(storagePath)

        const publicUrl = urlData.publicUrl

        // Insert asset record
        const { data: assetData, error: assetError } = await supabaseAdmin
            .from("assets")
            .insert({
                project_id: projectId,
                filename,
                file_type: fileType,
                wasabi_url: publicUrl,
                size_bytes: sizeBytes,
            })
            .select()
            .single()

        if (assetError) throw assetError

        revalidatePath(`/projects/${projectId}`)
        revalidatePath("/assets")
        return { success: true, asset: assetData }
    } catch (error) {
        console.error("Error uploading asset:", error)
        return { success: false, error }
    }
}
