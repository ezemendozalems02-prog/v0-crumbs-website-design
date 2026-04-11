import os
import sys
import subprocess

# Install supabase package
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

print("[v0] Connecting to Supabase...")

# Get all delivery categories
categories_response = supabase.table("categorias").select("id, nombre").eq("tipo_menu", "delivery").execute()
category_map = {cat["nombre"]: cat["id"] for cat in categories_response.data}

print(f"[v0] Found {len(category_map)} delivery categories")

# Delete all existing delivery products
print("[v0] Deleting existing delivery products...")
for cat_id in category_map.values():
    supabase.table("productos").delete().eq("categoria_id", cat_id).execute()

print("[v0] Deleted existing products")

# New products data
products_data = {
    "Entradas": [
        ("Papas Fritas", "", 7000, False, 1),
        ("Papas a Caballo", "", 9400, False, 2),
        ("Papas Bar", "", 13200, False, 3),
        ("Quesadillas de Pollo", "", 14500, False, 4),
        ("Quesadillas 4 Quesos", "", 14500, False, 5),
        ("Mini Burritos de Pollo (x3)", "", 11000, False, 6),
        ("Tequeños", "", 12000, False, 7),
        ("Empanadas de Vacío y Provoleta (x3)", "", 13200, False, 8),
        ("Langostinos en Panko", "", 15200, False, 9),
        ("Rabas", "", 15800, False, 10),
        ("Nuggets", "", 11900, False, 11),
        ("Nachos", "", 12000, False, 12),
    ],
    "Hamburguesas": [
        ("Americana Simple", "", 15500, False, 1),
        ("Americana Doble", "", 18000, False, 2),
        ("Parrillera Simple", "", 14000, False, 3),
        ("Parrillera Doble", "", 16500, False, 4),
        ("Clásica Simple", "", 13500, False, 5),
        ("Clásica Doble", "", 16000, False, 6),
        ("Royale Simple", "", 14000, False, 7),
        ("Royale Doble", "", 16500, False, 8),
        ("Takisburguer Simple", "", 15300, False, 9),
        ("Takisburguer Doble", "", 17800, False, 10),
    ],
    "Bowls": [
        ("Poke de Pollo Teriyaki", "", 16000, False, 1),
        ("Poke de Langostinos", "", 17600, False, 2),
    ],
    "Al Plato": [
        ("Suprema Grillé con Ensalada", "", 17400, False, 1),
        ("Milanesa con Puré", "", 17400, False, 2),
        ("Milanesa Napolitana con Papas", "", 21200, False, 3),
        ("Bondiola Braseada con Puré de Batata", "", 21200, False, 4),
    ],
    "Pastas": [
        ("Cintas", "", 9600, False, 1),
        ("Ravioles de Ricota y Verdura", "", 12000, False, 2),
        ("Sorrentinos de Jamón y Queso", "", 14400, False, 3),
        ("Salsa Filetto", "", 4200, False, 4),
        ("Salsa Crema + Tomates Confitados + Pesto", "", 5400, False, 5),
        ("Salsa Bolognesa", "", 6600, False, 6),
    ],
    "Ensaladas": [
        ("Caesar", "", 15400, False, 1),
        ("Cuzco", "", 16000, False, 2),
        ("Mediterránea", "", 18500, False, 3),
        ("Anticucha", "", 15500, False, 4),
        ("Capri", "", 17000, False, 5),
    ],
    "Pizzas Individuales": [
        ("Muzza y Albahaca", "", 11600, False, 1),
        ("Crudo y Rúcula", "", 14200, False, 2),
        ("Hongos y Queso Azul", "", 14200, False, 3),
    ],
    "Sandwiches": [
        ("Bacon", "", 17900, False, 1),
        ("Carne Queso", "", 14900, False, 2),
        ("Criollo", "", 16900, False, 3),
        ("Parisienne", "", 14900, False, 4),
        ("Napolitano", "", 16000, False, 5),
        ("Pulled Pork", "", 16000, False, 6),
        ("Milahuevo", "", 17900, False, 7),
        ("Bocata de Calamar", "", 14900, False, 8),
        ("Portobellos", "", 16000, False, 9),
        ("Viet-Ñam", "", 14900, False, 10),
    ],
    "Wraps": [
        ("Caesar", "", 15400, False, 1),
        ("Pollo Palta", "", 17000, False, 2),
        ("Tuna Wrap", "", 15400, False, 3),
        ("Ternera", "", 17000, False, 4),
        ("Hongos", "", 16000, False, 5),
    ],
    "Sin TACC / Tartas": [
        ("Tarta de Cabutia", "", 14900, True, 1),
        ("Tarta de Jamón y Queso", "", 14900, True, 2),
        ("Tarta de Vegetales", "", 14900, True, 3),
    ],
}

# Insert new products in batches
total_inserted = 0
for categoria, productos in products_data.items():
    if categoria not in category_map:
        print(f"[ERROR] Category {categoria} not found")
        continue
    
    cat_id = category_map[categoria]
    
    # Build batch
    batch = []
    for nombre, desc, precio, destacado, orden in productos:
        product = {
            "nombre": nombre,
            "descripcion": desc,
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": destacado,
            "orden": orden,
            "imagen_url": None,
            "etiquetas": None,
        }
        batch.append(product)
    
    # Insert batch
    try:
        response = supabase.table("productos").insert(batch).execute()
        if response.data:
            total_inserted += len(response.data)
            print(f"[v0] Inserted {len(response.data)} products for {categoria}")
    except Exception as e:
        print(f"[ERROR] Failed to insert {categoria}: {e}")

print(f"\n[v0] ✓ Successfully replaced all delivery products! Total: {total_inserted} products")
