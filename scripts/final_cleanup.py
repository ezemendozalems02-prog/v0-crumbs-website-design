import os
import sys
import subprocess

try:
    import supabase
except ImportError:
    print("[v0] Installing supabase...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "supabase"])

from supabase import create_client

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("[ERROR] Missing credentials")
    sys.exit(1)

supabase = create_client(url, key)

print("[v0] Getting all delivery products...")
response = supabase.table("productos").select("id, nombre, categoria:categorias(tipo_menu)").execute()
all_products = response.data or []

print(f"[v0] Found {len(all_products)} total products")

# Get delivery products
delivery_products = [p for p in all_products if p["categoria"] and p["categoria"]["tipo_menu"] == "delivery"]
print(f"[v0] Found {len(delivery_products)} delivery products")

# Find duplicates by name
seen = {}
to_delete = []

for product in delivery_products:
    name = product["nombre"]
    if name in seen:
        to_delete.append(product["id"])
        print(f"[v0] Duplicate found: {name} (ID: {product['id']})")
    else:
        seen[name] = product["id"]

print(f"[v0] Found {len(to_delete)} duplicates to delete")

# Delete duplicates
if to_delete:
    for product_id in to_delete:
        try:
            supabase.table("productos").delete().eq("id", product_id).execute()
            print(f"[v0] Deleted product ID: {product_id}")
        except Exception as e:
            print(f"[ERROR] Failed to delete {product_id}: {e}")

print(f"\n[v0] ✓ Cleanup complete! Removed {len(to_delete)} duplicates")
