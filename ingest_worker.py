
import os
import time
import uuid
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env variables (assuming .env.local is in the same directory)
load_dotenv('.env.local')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY") # Use Service Key for backend writes if possible, else Anon is fine if RLS allows

if not url or not key:
    print("Error: Supabase credentials not found in environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

WATCH_DIRECTORY = os.path.expanduser("~/Documents/ContentOS_Watch") # Placeholder path

class IngestHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return

        filepath = event.src_path
        filename = os.path.basename(filepath)
        
        # Parse parent folder name as "Project Title"
        parent_dir = os.path.dirname(filepath)
        project_title = os.path.basename(parent_dir)
        
        # Ignore files in the root watch directory, only process files inside project subfolders
        if parent_dir == WATCH_DIRECTORY:
            return

        print(f"New file detected: {filename} in project: {project_title}")
        
        self.process_file(filepath, filename, project_title)

    def process_file(self, filepath, filename, project_title):
        try:
            # 1. Check if Project exists (by title), if not create it
            # Note: This is a simplified logic. In real world, title collisions need handling.
            res = supabase.table('projects').select('id').eq('title', project_title).execute()
            
            project_id = None
            if res.data:
                project_id = res.data[0]['id']
                print(f"Found existing project ID: {project_id}")
            else:
                print(f"Creating new project: {project_title}")
                new_project = {
                    "id": str(uuid.uuid4()),
                    "title": project_title,
                    "status": "Scripting", # Default status
                    "folder_path": os.path.dirname(filepath),
                }
                res = supabase.table('projects').insert(new_project).execute()
                if res.data:
                     project_id = res.data[0]['id']

            if not project_id:
                print("Failed to get or create project ID.")
                return

            # 2. Insert file info into assets table
            # Simplified: checking size, mocking file_type and wasabi_url
            file_stats = os.stat(filepath)
            file_size = file_stats.st_size
            file_ext = os.path.splitext(filename)[1].replace('.', '')
            
            new_asset = {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "filename": filename,
                "file_type": file_ext,
                "wasabi_url": f"file://{filepath}", # Using local path for now as per plan
                "size_bytes": file_size,
                "created_at": "now()" # Let Postgres handle timestamp or format ISO string
            }
            
            asset_res = supabase.table('assets').insert(new_asset).execute()
            print(f"Asset ingested: {filename}")

        except Exception as e:
            print(f"Error processing file: {e}")

if __name__ == "__main__":
    if not os.path.exists(WATCH_DIRECTORY):
        os.makedirs(WATCH_DIRECTORY)
        print(f"Created watch directory: {WATCH_DIRECTORY}")

    event_handler = IngestHandler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_DIRECTORY, recursive=True)
    observer.start()
    print(f"Ingest Worker started. Watching: {WATCH_DIRECTORY}")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
