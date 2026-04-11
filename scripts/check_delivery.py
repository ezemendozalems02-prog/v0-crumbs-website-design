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

if not url or not key:
    print("[ERROR] Missing Supabase credentials")
    sys.exit(1)

sb = create_client(url, key)

# Get all delivery products
response = sb.table("productos").select("id, nombre, precio, categoria:categorias(nombre, tipo_menu)").eq("categoria.tipo_menu", "delivery").execute()

print(f"[v0] Total delivery products: {len(response.data)}\n")

for p in response.data:
    print(f"- {p['nombre']} (${p['precio']}) - {p['categoria']['nombre']}")

# Now delete all and reload with the correct 55
print("\n[v0] Getting all delivery products...")
all_delivery = sb.table("productos").select("id").eq("categoria.tipo_menu", "delivery").execute()

if all_delivery.data and len(all_delivery.data) > 55:
    ids_to_delete = [p['id'] for p in all_delivery.data[55:]]
    print(f"[v0] Deleting {len(ids_to_delete)} excess products...")
    for chunk in [ids_to_delete[i:i+10] for i in range(0, len(ids_to_delete), 10)]:
        sb.table("productos").delete().in_("id", chunk).execute()
    print(f"[v0] Deleted {len(ids_to_delete)} products")
