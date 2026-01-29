
import { supabaseAdmin } from './lib/supabase-admin'

async function inspectSchema() {
    console.log("Fetching one project to inspect schema...")
    const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .limit(1)

    if (error) {
        console.error("Error fetching project:", error)
        return
    }

    if (data && data.length > 0) {
        console.log("Row keys (columns):", Object.keys(data[0]))
        console.log("Sample Data:", data[0])
    } else {
        console.log("No projects found to inspect. Attempting to creating one to see if it works with minimal fields...")
        const { data: newData, error: newError } = await supabaseAdmin
            .from("projects")
            .insert({
                title: "Schema Probe",
                status: "Scripting",
                folder_path: "/probe"
            })
            .select()
            .single()

        if (newError) {
            console.error("Creation failed too:", newError)
        } else {
            console.log("Created Probe. Row keys:", Object.keys(newData))
        }
    }
}

inspectSchema()
