// THE CONTRACT (types/index.ts)
export interface Project {
    id: string;
    title: string;
    status: 'Scripting' | 'Shooting' | 'Editing' | 'Review' | 'Published';
    folder_path: string;
    description?: string;
    due_date?: string;
}

export interface Asset {
    id: string;
    project_id: string;
    filename: string;
    file_type: string;
    wasabi_url: string; // or local path
    size_bytes?: number;
    created_at: string;
}