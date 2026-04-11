import os
import sys
import subprocess

try:
    import supabase
except ImportError:
    print("[v0] Installing supabase package...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "supabase"])

from supabase import create_client

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("[ERROR] Missing Supabase credentials")
    sys.exit(1)

supabase = create_client(url, key)

print("[v0] Getting all productos...")
response = supabase.table("productos").select("*").execute()
all_products = response.data or []

print(f"[v0] Total productos en BD: {len(all_products)}")

# Contar duplicados
from collections import Counter
nombres = [p["nombre"] for p in all_products]
duplicados = {name: count for name, count in Counter(nombres).items() if count > 1}

if duplicados:
    print(f"\n[v0] Productos duplicados encontrados:")
    for nombre, count in duplicados.items():
        print(f"  - {nombre}: {count} veces")
    
    print(f"\n[v0] Eliminando duplicados...")
    for nombre, count in duplicados.items():
        # Obtener todos los IDs de este producto
        prods = supabase.table("productos").select("id").eq("nombre", nombre).execute().data or []
        
        # Mantener el primero, eliminar los demás
        for prod in prods[1:]:
            print(f"[v0] Eliminando duplicado: {nombre} (ID: {prod['id']})")
            supabase.table("productos").delete().eq("id", prod["id"]).execute()

print("\n[v0] Verificando productos de delivery...")
response = supabase.table("productos").select("*, categoria:categorias(tipo_menu)").execute()
todos = response.data or []

delivery_prods = [p for p in todos if p.get("categoria", {}).get("tipo_menu") == "delivery"]
carta_prods = [p for p in todos if p.get("categoria", {}).get("tipo_menu") in ["desayuno", "almuerzo_cena"]]

print(f"[v0] Productos en Delivery: {len(delivery_prods)}")
print(f"[v0] Productos en Carta: {len(carta_prods)}")

print("\n✓ Limpieza completada!")
