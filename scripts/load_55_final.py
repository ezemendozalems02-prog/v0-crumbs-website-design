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

print("[v0] Iniciando carga de 55 productos de delivery...")

# Crear todas las categorías de delivery
categories_to_create = [
    ("Entradas", "entradas"),
    ("Hamburguesas", "hamburguesas"),
    ("Bowls", "bowls"),
    ("Al Plato", "al-plato"),
    ("Pastas", "pastas"),
    ("Ensaladas", "ensaladas"),
    ("Pizzas Individuales", "pizzas-individuales"),
    ("Sandwiches", "sandwiches"),
    ("Wraps", "wraps"),
    ("Sin TACC / Tartas", "sin-tacc-tartas"),
]

cat_ids = {}
for nombre, slug in categories_to_create:
    try:
        response = sb.table("categorias").select("id").eq("slug", slug).execute()
        if response.data:
            cat_ids[nombre] = response.data[0]["id"]
            print(f"[v0] Categoría {nombre} ya existe")
        else:
            response = sb.table("categorias").insert({
                "nombre": nombre,
                "slug": slug,
                "tipo_menu": "delivery",
                "activa": True,
                "orden": list(categories_to_create).index((nombre, slug)) + 1
            }).execute()
            if response.data:
                cat_ids[nombre] = response.data[0]["id"]
                print(f"[v0] Categoría {nombre} creada")
    except Exception as e:
        print(f"[ERROR] {e}")

# Eliminar productos de delivery anteriores
try:
    response = sb.table("productos").select("id").eq("tipo_menu", "delivery").execute()
    old_products = response.data or []
    
    for prod in old_products:
        try:
            sb.table("productos").delete().eq("id", prod["id"]).execute()
        except:
            pass
    
    print(f"[v0] {len(old_products)} productos anteriores eliminados")
except Exception as e:
    print(f"[v0] No hay productos anteriores: {e}")

# Datos de los 55 productos
productos_data = {
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
        ("Caesar Wrap", 15400),
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

# Insertar productos por lotes
total_inserted = 0
for categoria, productos in productos_data.items():
    if categoria not in cat_ids:
        print(f"[WARN] Categoría {categoria} no encontrada")
        continue
    
    cat_id = cat_ids[categoria]
    batch = []
    
    for orden, (nombre, precio) in enumerate(productos, 1):
        batch.append({
            "nombre": nombre,
            "descripcion": "",
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": False,
            "orden": orden,
            "imagen_url": None,
            "etiquetas": None,
        })
    
    try:
        response = sb.table("productos").insert(batch).execute()
        if response.data:
            total_inserted += len(response.data)
            print(f"[v0] {categoria}: {len(response.data)} productos insertados")
    except Exception as e:
        print(f"[ERROR] {categoria}: {e}")

print(f"\n[v0] ✓ {total_inserted} productos de delivery cargados exitosamente!")
