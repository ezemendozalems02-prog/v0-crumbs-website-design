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

supabase_client = create_client(url, key)

print("[v0] Conectando a Supabase...")

# Get all delivery products
try:
    response = supabase_client.table("productos").select("*").eq("categoria_id", 
        supabase_client.table("categorias").select("id").eq("tipo_menu", "delivery").execute().data[0]["id"] if 
        supabase_client.table("categorias").select("id").eq("tipo_menu", "delivery").execute().data else None
    ).execute()
except:
    pass

# Get all products with their categories
response = supabase_client.table("productos").select("*, categoria:categorias(*)").execute()
all_products = response.data if response.data else []

print(f"[v0] Total productos: {len(all_products)}")

# Find duplicates
product_names = {}
duplicates_to_delete = []

for product in all_products:
    name = product["nombre"].strip()
    if name in product_names:
        # Found duplicate
        duplicates_to_delete.append(product["id"])
        print(f"[v0] Duplicado encontrado: {name} (ID: {product['id']})")
    else:
        product_names[name] = product["id"]

print(f"\n[v0] Total duplicados a eliminar: {len(duplicates_to_delete)}")

# Delete duplicates
if duplicates_to_delete:
    for dup_id in duplicates_to_delete:
        try:
            supabase_client.table("productos").delete().eq("id", dup_id).execute()
            print(f"[v0] Eliminado: {dup_id}")
        except Exception as e:
            print(f"[ERROR] No se pudo eliminar {dup_id}: {e}")

# Verify all remaining products are in delivery
print("\n[v0] Verificando que todos los productos estén en delivery...")

# Get all delivery category IDs
delivery_cats = supabase_client.table("categorias").select("id").eq("tipo_menu", "delivery").execute()
delivery_cat_ids = [cat["id"] for cat in delivery_cats.data] if delivery_cats.data else []

print(f"[v0] IDs de categorías delivery: {delivery_cat_ids}")

# Get current products
all_products = supabase_client.table("productos").select("*, categoria:categorias(*)").execute().data or []

non_delivery = [p for p in all_products if p["categoria_id"] not in delivery_cat_ids]
print(f"[v0] Productos en categorías no-delivery: {len(non_delivery)}")

for p in non_delivery:
    print(f"  - {p['nombre']} (categoría_id: {p['categoria_id']}, tipo: {p.get('categoria', {}).get('tipo_menu')})")

print(f"\n[v0] ✓ Limpieza completada")
print(f"[v0] Productos totales restantes: {len(all_products) - len(non_delivery)}")
