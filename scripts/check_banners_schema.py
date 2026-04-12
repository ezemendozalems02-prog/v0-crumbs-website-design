import os
import sys
import subprocess

try:
    import supabase
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "supabase"])

from supabase import create_client

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

# Check banners table structure
response = supabase.table("banners").select("*").limit(1).execute()
if response.data:
    print("[v0] Banners table columns:")
    for key in response.data[0].keys():
        print(f"  - {key}")
else:
    print("[v0] No banners found, checking table info...")
