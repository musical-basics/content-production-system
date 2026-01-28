import { Project, Asset } from "@/types"

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Product Launch Video",
    status: "Scripting",
    folder_path: "/projects/product-launch",
    description: "Launch video for Q3 flagship product",
    due_date: "2026-03-01"
  },
  {
    id: "2",
    title: "Brand Documentary",
    status: "Shooting",
    folder_path: "/projects/brand-doc",
    description: "Company history documentary",
    due_date: "2026-04-15"
  },
  {
    id: "3",
    title: "Social Ads Q1",
    status: "Editing",
    folder_path: "/projects/social-q1",
    description: "Instagram and TikTok vertical ads",
    due_date: "2026-02-20"
  },
  {
    id: "4",
    title: "Customer Testimonials",
    status: "Review",
    folder_path: "/projects/testimonials",
    description: "Interview series with key clients",
    due_date: "2026-02-28"
  },
  {
    id: "5",
    title: "Town Hall Recording",
    status: "Published",
    folder_path: "/projects/town-hall-jan",
    description: "Internal company meeting",
    due_date: "2026-01-15"
  }
]

export const mockAssets: Asset[] = [
  // Project 1 Assets
  {
    id: "a1",
    project_id: "1",
    filename: "script_v1.pdf",
    file_type: "pdf",
    wasabi_url: "https://wasabi.com/bucket/script_v1.pdf",
    size_bytes: 1024000,
    created_at: "2026-02-01T10:00:00Z"
  },
  {
    id: "a2",
    project_id: "1",
    filename: "moodboard.jpg",
    file_type: "jpg",
    wasabi_url: "https://wasabi.com/bucket/moodboard.jpg",
    size_bytes: 5000000,
    created_at: "2026-02-01T11:30:00Z"
  },
  // Project 2 Assets
  {
    id: "a3",
    project_id: "2",
    filename: "interview_A_cam.mp4",
    file_type: "mp4",
    wasabi_url: "https://wasabi.com/bucket/interview_A.mp4",
    size_bytes: 4500000000,
    created_at: "2026-03-10T09:00:00Z"
  },
  {
    id: "a4",
    project_id: "2",
    filename: "interview_B_cam.mp4",
    file_type: "mp4",
    wasabi_url: "https://wasabi.com/bucket/interview_B.mp4",
    size_bytes: 4200000000,
    created_at: "2026-03-10T09:00:00Z"
  },
  // Project 3 Assets
  {
    id: "a5",
    project_id: "3",
    filename: "vertical_draft_v1.mp4",
    file_type: "mp4",
    wasabi_url: "https://wasabi.com/bucket/vertical_v1.mp4",
    size_bytes: 150000000,
    created_at: "2026-02-15T14:20:00Z"
  },
  // Project 4 Assets
  {
    id: "a6",
    project_id: "4",
    filename: "client_logo.png",
    file_type: "png",
    wasabi_url: "https://wasabi.com/bucket/logo.png",
    size_bytes: 2000000,
    created_at: "2026-02-01T10:00:00Z"
  },
  // Spreading out remaining assets
  {
    id: "a7",
    project_id: "1",
    filename: "raw_footage_day1.zip",
    file_type: "zip",
    wasabi_url: "https://wasabi.com/bucket/footage.zip",
    size_bytes: 12000000000,
    created_at: "2026-02-05T16:45:00Z"
  },
  {
    id: "a8",
    project_id: "2",
    filename: "location_scout_notes.txt",
    file_type: "txt",
    wasabi_url: "https://wasabi.com/bucket/notes.txt",
    size_bytes: 5000,
    created_at: "2026-03-01T08:00:00Z"
  },
  {
    id: "a9",
    project_id: "3",
    filename: "music_track.wav",
    file_type: "wav",
    wasabi_url: "https://wasabi.com/bucket/music.wav",
    size_bytes: 50000000,
    created_at: "2026-02-10T12:00:00Z"
  },
  {
    id: "a10",
    project_id: "5",
    filename: "recording_final.mp4",
    file_type: "mp4",
    wasabi_url: "https://wasabi.com/bucket/townhall.mp4",
    size_bytes: 2500000000,
    created_at: "2026-01-16T10:00:00Z"
  }
]
