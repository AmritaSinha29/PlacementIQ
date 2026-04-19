import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# We initialize the client conditionally to avoid crashing if env vars are missing during setup
supabase: Client | None = None

if url and key:
    supabase = create_client(url, key)

def get_supabase() -> Client:
    if not supabase:
        raise ValueError("Supabase client is not initialized. Please set SUPABASE_URL and SUPABASE_KEY.")
    return supabase
