import os
import sys
import subprocess

# Install supabase package first
try:
    import supabase
except ImportError:
    print("[v0] Installing supabase package...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "supabase"])

from supabase import create_client

# Get credentials from environment
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("[ERROR] Missing Supabase credentials")
    sys.exit(1)

supabase_client = create_client(url, key)

print("[v0] Connecting to Supabase...")

# New products data from user
products_data = {
    "Bowls": [
        ("Poke de Salmon", "Arroz, salmón marinado, edamame, arándanos, pepino y salsa ponzu", 18500, False, 1),
        ("Poke de Atún", "Arroz, atún marinado, aguacate, edamame, cebolla morada y salsa spicy", 17800, False, 2),
        ("Buddha Bowl", "Arroz integral, huevo, brócoli, zanahoria, remolacha y salsa tahini", 15500, False, 3),
        ("Green Bowl", "Base de espinaca, pollo grillado, quinoa, frutos secos y vinagreta", 16000, False, 4),
        ("Shrimp Bowl", "Arroz, camarones salteados, piña, coco y salsa dulce", 17500, False, 5),
    ],
    "Wraps": [
        ("Wrap de Pollo", "Pollo grillado, lechuga, tomate, cebolla y mayo", 13500, False, 1),
        ("Wrap de Veggie", "Hummus, lechuga, tomate, pepino, zanahoria y rúcula", 12000, False, 2),
        ("Wrap de Carne", "Carne asada, cebolla, chimichurri y queso", 14500, False, 3),
        ("Wrap de Atún", "Atún, lechuga, tomate, cebolla y alioli", 14000, False, 4),
        ("Wrap Vegano", "Tofu marinado, vegetales asados, aguacate y salsa tahini", 13000, False, 5),
    ],
    "Sin TACC / Tartas": [
        ("Tarta de Brócoli", "Tarta sin TACC de brócoli y queso", 16500, True, 1),
        ("Tarta de Espinaca y Ricota", "Tarta sin TACC de espinaca con ricota fresca", 16500, True, 2),
        ("Tarta de Pollo", "Tarta sin TACC de pollo desmenuzado", 17000, True, 3),
    ],
}

# Categories to create
categories_to_create = [
    ("Bowls", "bowls", "delivery", 3),
    ("Wraps", "wraps", "delivery", 9),
    ("Sin TACC / Tartas", "sin-tacc-tartas", "delivery", 10),
]

# Step 1: Create/update categories
print("\n[v0] Creating delivery categories...")
cat_ids = {}

for nombre, slug, tipo_menu, orden in categories_to_create:
    try:
        # Try to get existing category
        response = supabase_client.table("categorias").select("id").eq("slug", slug).execute()
        if response.data:
            cat_ids[nombre] = response.data[0]["id"]
            print(f"[v0] Category '{nombre}' already exists (ID: {response.data[0]['id']})")
            continue
    except Exception as e:
        print(f"[v0] Checking for {nombre}: {e}")
    
    # Create new category if not found
    try:
        response = supabase_client.table("categorias").insert({
            "nombre": nombre,
            "slug": slug,
            "tipo_menu": tipo_menu,
            "activa": True,
            "orden": orden
        }).execute()
        
        if response.data:
            cat_ids[nombre] = response.data[0]["id"]
            print(f"[v0] Created category '{nombre}' (ID: {response.data[0]['id']})")
    except Exception as e:
        print(f"[ERROR] Failed to create category {nombre}: {e}")

# Step 2: Delete existing delivery products from these categories
print("\n[v0] Deleting existing delivery products...")
for categoria_nombre in products_data.keys():
    if categoria_nombre not in cat_ids:
        print(f"[ERROR] Category '{categoria_nombre}' not found")
        continue
    
    cat_id = cat_ids[categoria_nombre]
    try:
        response = supabase_client.table("productos").delete().eq("categoria_id", cat_id).execute()
        print(f"[v0] Deleted existing products from '{categoria_nombre}'")
    except Exception as e:
        print(f"[ERROR] Failed to delete products for {categoria_nombre}: {e}")

# Step 3: Insert new products in batches
print("\n[v0] Inserting new delivery products...")
total_inserted = 0

for categoria_nombre, productos_lista in products_data.items():
    if categoria_nombre not in cat_ids:
        print(f"[ERROR] Category '{categoria_nombre}' not in cat_ids")
        continue
    
    cat_id = cat_ids[categoria_nombre]
    
    # Build batch
    batch = []
    for nombre, desc, precio, destacado, orden in productos_lista:
        batch.append({
            "nombre": nombre,
            "descripcion": desc,
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": destacado,
            "orden": orden,
            "imagen_url": None,
            "etiquetas": None,
        })
    
    try:
        response = supabase_client.table("productos").insert(batch).execute()
        if response.data:
            total_inserted += len(response.data)
            print(f"[v0] Inserted {len(response.data)} products for '{categoria_nombre}'")
    except Exception as e:
        print(f"[ERROR] Batch insert failed for {categoria_nombre}: {e}")

print(f"\n[v0] ✓ Successfully replaced all delivery products!")
print(f"[v0] Total: {total_inserted} products in {len(cat_ids)} categories")
