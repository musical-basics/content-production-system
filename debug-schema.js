
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("Fetching one project to inspect schema...");
    const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching project:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Row keys (columns):", Object.keys(data[0]));
        console.log("Sample Data:", data[0]);
    } else {
        console.log("No projects found. Creating probe...");
        // Create probe
        const { data: newData, error: newError } = await supabaseAdmin
            .from("projects")
            .insert({
                title: "Schema Probe",
                status: "Scripting",
                folder_path: "/probe"
            })
            .select()
            .single();

        if (newError) {
            console.error("Creation failed:", newError);
        } else {
            console.log("Created Probe. Row keys:", Object.keys(newData));
        }
    }
}

inspectSchema();
