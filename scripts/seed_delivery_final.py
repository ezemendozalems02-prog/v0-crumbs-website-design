import os
import sys
import subprocess
import time

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

supabase = create_client(url, key)

# Categories data
categories = [
    ("Entradas", "entradas", "delivery", True, 1),
    ("Hamburguesas", "hamburguesas", "delivery", True, 2),
    ("Bowls", "bowls", "delivery", True, 3),
    ("Al Plato", "al-plato", "delivery", True, 4),
    ("Pastas", "pastas", "delivery", True, 5),
    ("Ensaladas", "ensaladas", "delivery", True, 6),
    ("Pizzas Individuales", "pizzas-individuales", "delivery", True, 7),
    ("Sandwiches", "sandwiches", "delivery", True, 8),
    ("Wraps", "wraps", "delivery", True, 9),
    ("Sin TACC / Tartas", "sin-tacc-tartas", "delivery", True, 10),
]

# Products data
products_data = {
    "Entradas": [
        ("Papas Fritas", "Papas fritas crocantes con sal marina", 7000, False, 1),
        ("Papas a Caballo", "Papas con salsa de queso", 9400, False, 2),
        ("Papas Bar", "Con cheddar, panceta y cebolla de verdeo", 13200, False, 3),
        ("Quesadillas de Pollo", "Quesadillas rellenas de pollo", 14500, False, 4),
        ("Quesadillas 4 Quesos", "Quesadillas con mezcla de 4 quesos", 14500, False, 5),
        ("Mini Burritos de Pollo (x3)", "Mini burritos de pollo", 11000, False, 6),
        ("Tequeños", "Tequeños rellenos de queso", 12000, False, 7),
        ("Empanadas de Vacío y Provoleta (x3)", "Empanadas", 13200, False, 8),
        ("Langostinos en Panko", "Langostinos rebozados en panko", 15200, False, 9),
        ("Rabas", "Rabas a la romana", 15800, False, 10),
        ("Nuggets", "Nuggets con salsa de miel mostaza", 11900, False, 11),
        ("Nachos", "Nachos con cheddar y jalapeños", 12000, False, 12),
    ],
    "Hamburguesas": [
        ("Americana Simple", "Hamburguesa Americana - Simple", 15500, False, 1),
        ("Americana Doble", "Hamburguesa Americana - Doble", 18000, False, 2),
        ("Parrillera Simple", "Hamburguesa Parrillera - Simple", 14000, False, 3),
        ("Parrillera Doble", "Hamburguesa Parrillera - Doble", 16500, False, 4),
        ("Clásica Simple", "Hamburguesa Clásica - Simple", 13500, False, 5),
        ("Clásica Doble", "Hamburguesa Clásica - Doble", 16000, False, 6),
        ("Royale Simple", "Hamburguesa Royale - Simple", 14000, False, 7),
        ("Royale Doble", "Hamburguesa Royale - Doble", 16500, False, 8),
        ("Takisburguer Simple", "Hamburguesa Takis - Simple", 15300, False, 9),
        ("Takisburguer Doble", "Hamburguesa Takis - Doble", 17800, False, 10),
    ],
    "Bowls": [
        ("Poke de Pollo Teriyaki", "Base de arroz, pollo marinado en teriyaki, edamame y vegetales", 16000, False, 1),
        ("Poke de Langostinos", "Base de arroz, langostinos frescos, palta, edamame y salsa ponzu", 17600, False, 2),
    ],
    "Al Plato": [
        ("Suprema Grillé con Ensalada", "Pechuga de pollo grillada con ensalada fresca", 17400, False, 1),
        ("Milanesa con Puré", "Milanesa y puré de papas", 17400, False, 2),
        ("Milanesa Napolitana con Papas", "Milanesa napolitana con papas fritas", 21200, False, 3),
        ("Bondiola Braseada con Puré de Batata", "Bondiola braseada con puré de batata", 21200, False, 4),
    ],
    "Pastas": [
        ("Cintas", "Pasta casera cintas", 9600, False, 1),
        ("Ravioles de Ricota y Verdura", "Ravioles rellenos de ricota y verduras", 12000, False, 2),
        ("Sorrentinos de Jamón y Queso", "Sorrentinos rellenos de jamón y queso", 14400, False, 3),
        ("Salsa Filetto", "Salsa a base de tomate", 4200, False, 4),
        ("Salsa Crema + Tomates Confitados + Pesto", "Salsa cremosa con tomates confitados", 5400, False, 5),
        ("Salsa Bolognesa", "Salsa a la bolognesa", 6600, False, 6),
    ],
    "Ensaladas": [
        ("Caesar", "Lechuga romana, pollo, parmesano, croutons y aderezo caesar", 15400, False, 1),
        ("Cuzco", "Ensalada Cuzco con ingredientes especiales", 16000, False, 2),
        ("Mediterránea", "Ensalada mediterránea con tomate, mozzarella y aceitunas", 18500, False, 3),
        ("Anticucha", "Ensalada anticucha con carnes y vegetales", 15500, False, 4),
        ("Capri", "Tomate, mozzarella fresca, rúcula y aceite de oliva", 17000, False, 5),
    ],
    "Pizzas Individuales": [
        ("Muzza y Albahaca", "Pizza clásica con mozzarella y albahaca fresca", 11600, False, 1),
        ("Crudo y Rúcula", "Pizza con jamón crudo y rúcula", 14200, False, 2),
        ("Hongos y Queso Azul", "Pizza con hongos y queso azul", 14200, False, 3),
    ],
    "Sandwiches": [
        ("Bacon", "Sándwich con bacon crocante", 17900, False, 1),
        ("Carne Queso", "Sándwich de carne y queso", 14900, False, 2),
        ("Criollo", "Sándwich criollo con carnes", 16900, False, 3),
        ("Parisienne", "Sándwich parisienne", 14900, False, 4),
        ("Napolitano", "Sándwich napolitano con jamón y queso", 16000, False, 5),
        ("Pulled Pork", "Sándwich con carne deshilachada", 16000, False, 6),
        ("Milahuevo", "Sándwich milanesa con huevo frito", 17900, False, 7),
        ("Bocata de Calamar", "Bocata de calamares fritos", 14900, False, 8),
        ("Portobellos", "Sándwich con hongos portobello", 16000, False, 9),
        ("Viet-Ñam", "Sándwich estilo vietnamita", 14900, False, 10),
    ],
    "Wraps": [
        ("Caesar Wrap", "Wrap Caesar con pollo, lechuga y queso sardo", 15400, False, 1),
        ("Pollo Palta", "Wrap con pollo, palta, tomate y espinaca", 17000, False, 2),
        ("Tuna Wrap", "Wrap con atún, lechuga y vegetales frescos", 15400, False, 3),
        ("Ternera", "Wrap con ternera y vegetales asados", 17000, False, 4),
        ("Hongos", "Wrap vegetariano con hongos y queso", 16000, False, 5),
    ],
    "Sin TACC / Tartas": [
        ("Tarta de Cabutia", "Tarta sin TACC de cabutia", 14900, True, 1),
        ("Tarta de Jamón y Queso", "Tarta sin TACC de jamón y queso", 14900, True, 2),
        ("Tarta de Vegetales", "Tarta sin TACC de vegetales", 14900, True, 3),
    ],
}

# Create or get categories
cat_ids = {}
for nombre, slug, tipo_menu, activa, orden in categories:
    try:
        response = supabase.table("categorias").select("id").eq("slug", slug).execute()
        if response.data:
            cat_ids[nombre] = response.data[0]["id"]
            print(f"[v0] Category {nombre} already exists")
            continue
    except Exception as e:
        pass
    
    try:
        response = supabase.table("categorias").insert({
            "nombre": nombre,
            "slug": slug,
            "tipo_menu": tipo_menu,
            "activa": activa,
            "orden": orden
        }).execute()
        
        if response.data:
            cat_ids[nombre] = response.data[0]["id"]
            print(f"[v0] Created category: {nombre}")
    except Exception as e:
        print(f"[ERROR] Failed to create category {nombre}: {e}")

# Insert products in batches
total_inserted = 0
for categoria_nombre, productos in products_data.items():
    if categoria_nombre not in cat_ids:
        print(f"[ERROR] Category {categoria_nombre} not in cat_ids")
        continue
    
    cat_id = cat_ids[categoria_nombre]
    batch = []
    
    for nombre, desc, precio, destacado, orden in productos:
        batch.append({
            "nombre": nombre,
            "descripcion": desc,
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": destacado,
            "orden": orden,
        })
    
    try:
        response = supabase.table("productos").insert(batch).execute()
        if response.data:
            total_inserted += len(response.data)
            print(f"[v0] Inserted {len(response.data)} products for {categoria_nombre}")
    except Exception as e:
        print(f"[ERROR] Failed to insert products for {categoria_nombre}: {e}")
    
    time.sleep(0.3)

print(f"\n[v0] ✓ Successfully inserted {total_inserted} products!")
