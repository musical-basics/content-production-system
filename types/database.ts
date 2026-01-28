
export interface Project {
    id: string; // uuid
    title: string;
    status: string;
    folder_path: string;
}

export interface Asset {
    id: string; // uuid
    project_id: string; // uuid
    filename: string;
    wasabi_url: string;
    file_type: string;
}
