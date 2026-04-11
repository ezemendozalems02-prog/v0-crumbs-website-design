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

# Test 1: Check if we can read from categorias
print("[v0] Test 1: Reading categories")
try:
    resp = supabase.table("categorias").select("id, nombre, slug").limit(2).execute()
    print(f"[v0] Found {len(resp.data)} categories")
    for cat in resp.data:
        print(f"  - {cat['nombre']} (slug: {cat['slug']})")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 2: Try to insert a single product
print("\n[v0] Test 2: Inserting a test product")
try:
    # Get first category ID
    cat_resp = supabase.table("categorias").select("id").limit(1).execute()
    if cat_resp.data:
        cat_id = cat_resp.data[0]["id"]
        
        prod = {
            "nombre": "Test Product",
            "descripcion": "Este es un producto de prueba",
            "precio": 1000,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": False,
            "orden": 999,
            "imagen_url": None,
            "etiquetas": None,
        }
        
        prod_resp = supabase.table("productos").insert(prod).execute()
        print(f"[v0] Product inserted successfully")
        print(f"[v0] Response: {prod_resp.data}")
except Exception as e:
    print(f"[ERROR] {e}")

print("\n[v0] Test complete")
