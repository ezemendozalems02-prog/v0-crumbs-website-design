import os
import sys
import subprocess
import time

# Install supabase package
try:
    import supabase
except ImportError:
    print("[v0] Installing supabase package...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "supabase"])

from supabase import create_client

# Get credentials
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("[ERROR] Missing Supabase credentials")
    sys.exit(1)

supabase = create_client(url, key)

print("[v0] Connecting to Supabase...")

# All delivery products with categories
delivery_data = {
    "Entradas": [
        ("Papas Fritas", 7000),
        ("Papas a Caballo", 9400),
        ("Papas Bar", 13200),
        ("Quesadillas de Pollo", 14500),
        ("Quesadillas 4 Quesos", 14500),
        ("Mini Burritos de Pollo (x3)", 11000),
        ("Tequeños", 12000),
        ("Empanadas de Vacío y Provoleta (x3)", 13200),
        ("Langostinos en Panko", 15200),
        ("Rabas", 15800),
        ("Nuggets", 11900),
        ("Nachos", 12000),
    ],
    "Hamburguesas": [
        ("Americana Simple", 15500),
        ("Americana Doble", 18000),
        ("Parrillera Simple", 14000),
        ("Parrillera Doble", 16500),
        ("Clásica Simple", 13500),
        ("Clásica Doble", 16000),
        ("Royale Simple", 14000),
        ("Royale Doble", 16500),
        ("Takisburguer Simple", 15300),
        ("Takisburguer Doble", 17800),
    ],
    "Bowls": [
        ("Poke de Pollo Teriyaki", 16000),
        ("Poke de Langostinos", 17600),
    ],
    "Al Plato": [
        ("Suprema Grillé con Ensalada", 17400),
        ("Milanesa con Puré", 17400),
        ("Milanesa Napolitana con Papas", 21200),
        ("Bondiola Braseada con Puré de Batata", 21200),
    ],
    "Pastas": [
        ("Cintas", 9600),
        ("Ravioles de Ricota y Verdura", 12000),
        ("Sorrentinos de Jamón y Queso", 14400),
        ("Salsa Filetto", 4200),
        ("Salsa Crema + Tomates Confitados + Pesto", 5400),
        ("Salsa Bolognesa", 6600),
    ],
    "Ensaladas": [
        ("Caesar", 15400),
        ("Cuzco", 16000),
        ("Mediterránea", 18500),
        ("Anticucha", 15500),
        ("Capri", 17000),
    ],
    "Pizzas Individuales": [
        ("Muzza y Albahaca", 11600),
        ("Crudo y Rúcula", 14200),
        ("Hongos y Queso Azul", 14200),
    ],
    "Sandwiches": [
        ("Bacon", 17900),
        ("Carne Queso", 14900),
        ("Criollo", 16900),
        ("Parisienne", 14900),
        ("Napolitano", 16000),
        ("Pulled Pork", 16000),
        ("Milahuevo", 17900),
        ("Bocata de Calamar", 14900),
        ("Portobellos", 16000),
        ("Viet-Ñam", 14900),
    ],
    "Wraps": [
        ("Caesar", 15400),
        ("Pollo Palta", 17000),
        ("Tuna Wrap", 15400),
        ("Ternera", 17000),
        ("Hongos", 16000),
    ],
    "Sin TACC / Tartas": [
        ("Tarta de Cabutia", 14900),
        ("Tarta de Jamón y Queso", 14900),
        ("Tarta de Vegetales", 14900),
    ],
}

# Get or create categories
cat_ids = {}
for cat_nombre in delivery_data.keys():
    slug = cat_nombre.lower().replace(" ", "-").replace("/", "-")
    
    # Try to get existing category
    try:
        response = supabase.table("categorias").select("id").eq("slug", slug).execute()
        if response.data:
            cat_ids[cat_nombre] = response.data[0]["id"]
            print(f"[v0] Category '{cat_nombre}' already exists")
            continue
    except:
        pass
    
    # Create new category
    try:
        response = supabase.table("categorias").insert({
            "nombre": cat_nombre,
            "slug": slug,
            "tipo_menu": "delivery",
            "activa": True,
            "orden": list(delivery_data.keys()).index(cat_nombre) + 1
        }).execute()
        
        if response.data:
            cat_ids[cat_nombre] = response.data[0]["id"]
            print(f"[v0] Category '{cat_nombre}' created")
    except Exception as e:
        print(f"[ERROR] Failed to create category {cat_nombre}: {e}")

# Delete all existing delivery products
try:
    # Get all delivery categories
    cat_response = supabase.table("categorias").select("id").eq("tipo_menu", "delivery").execute()
    if cat_response.data:
        cat_ids_to_delete = [c["id"] for c in cat_response.data]
        
        for cat_id in cat_ids_to_delete:
            supabase.table("productos").delete().eq("categoria_id", cat_id).execute()
        
        print(f"[v0] Deleted existing delivery products")
except Exception as e:
    print(f"[ERROR] Failed to delete products: {e}")

# Insert all new products in batches
total_inserted = 0
for categoria, productos in delivery_data.items():
    if categoria not in cat_ids:
        print(f"[ERROR] Category {categoria} not found")
        continue
    
    cat_id = cat_ids[categoria]
    batch = []
    
    for idx, (nombre, precio) in enumerate(productos, 1):
        batch.append({
            "nombre": nombre,
            "descripcion": nombre,
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": False,
            "orden": idx,
            "imagen_url": None,
            "etiquetas": None,
        })
    
    # Insert batch
    try:
        response = supabase.table("productos").insert(batch).execute()
        if response.data:
            total_inserted += len(response.data)
            print(f"[v0] Inserted {len(response.data)} products for '{categoria}'")
    except Exception as e:
        print(f"[ERROR] Failed to insert products for {categoria}: {e}")
    
    time.sleep(0.3)

print(f"\n[v0] ✓ Successfully loaded {total_inserted} delivery products!")
