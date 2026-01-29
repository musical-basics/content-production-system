
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

async function testMove() {
    console.log("Fetching a project...");
    const { data: projects, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching project:", error);
        return;
    }

    if (!projects || projects.length === 0) {
        console.log("No projects found to test.");
        return;
    }

    const project = projects[0];
    console.log(`Found Project: ${project.title} (${project.id}) - Status: ${project.status}`);

    const newStatus = project.status === 'Scripting' ? 'Shooting' : 'Scripting'; // Toggle
    console.log(`Attempting to update status to: ${newStatus}`);

    const { error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);

    if (updateError) {
        console.error("Update failed:", updateError);
    } else {
        console.log("Update successful (no error returned).");

        // Verify
        const { data: checkData } = await supabaseAdmin
            .from('projects')
            .select('status')
            .eq('id', project.id)
            .single();

        console.log(`Verification: Status is now ${checkData.status}`);
    }
}

testMove();
