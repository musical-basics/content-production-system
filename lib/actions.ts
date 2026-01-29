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

export async function linkAssetToProject(assetId: string, projectId: string) {
    try {
        // 1. Get the original asset
        const { data: original, error: fetchError } = await supabaseAdmin
            .from("assets")
            .select("*")
            .eq("id", assetId)
            .single()

        if (fetchError) throw fetchError

        // 2. Insert as a new entry for the target project (pointing to same storage)
        const { data: linked, error: linkError } = await supabaseAdmin
            .from("assets")
            .insert({
                project_id: projectId,
                filename: original.filename,
                file_type: original.file_type,
                wasabi_url: original.wasabi_url,
                size_bytes: original.size_bytes,
            })
            .select()
            .single()

        if (linkError) throw linkError

        revalidatePath(`/projects/${projectId}`)
        return { success: true, asset: linked }
    } catch (error) {
        console.error("Error linking asset:", error)
        return { success: false, error }
    }
}
