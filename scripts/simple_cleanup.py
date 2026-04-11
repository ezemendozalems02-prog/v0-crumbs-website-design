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
    print("[ERROR] Missing credentials")
    sys.exit(1)

client = create_client(url, key)

print("[v0] Obteniendo todos los productos...")
all_prods = client.table("productos").select("*, categoria:categorias(*)").execute().data or []
print(f"[v0] Total: {len(all_prods)}")

# Agrupar por nombre para detectar duplicados
by_name = {}
duplicates = []

for p in all_prods:
    name = p["nombre"].strip().lower()
    if name not in by_name:
        by_name[name] = []
    by_name[name].append(p)

# Encontrar duplicados
for name, products in by_name.items():
    if len(products) > 1:
        duplicates.extend(products[1:])
        print(f"[v0] Duplicado: {name} (x{len(products)})")

print(f"\n[v0] Total duplicados encontrados: {len(duplicates)}")

# Eliminar duplicados
deleted = 0
for dup in duplicates:
    try:
        client.table("productos").delete().eq("id", dup["id"]).execute()
        deleted += 1
        print(f"  ✓ Eliminado: {dup['nombre']}")
    except Exception as e:
        print(f"  ✗ Error: {dup['nombre']}: {e}")

print(f"\n[v0] ✓ Completado - {deleted} duplicados eliminados")
