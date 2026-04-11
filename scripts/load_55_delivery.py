import os
import sys
import subprocess

# Install supabase
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

# Datos de los 55 productos de delivery
products_data = {
    "Entradas": [
        ("Papas Fritas", "Papas fritas crocantes con sal marina", 7000),
        ("Papas a Caballo", "Papas con salsa de queso", 9400),
        ("Papas Bar", "Con cheddar, panceta y cebolla de verdeo", 13200),
        ("Quesadillas de Pollo", "Quesadillas rellenas de pollo", 14500),
        ("Quesadillas 4 Quesos", "Quesadillas con mezcla de 4 quesos", 14500),
        ("Mini Burritos de Pollo (x3)", "Mini burritos de pollo", 11000),
        ("Tequeños", "Tequeños rellenos de queso", 12000),
        ("Empanadas de Vacío y Provoleta (x3)", "Empanadas", 13200),
        ("Langostinos en Panko", "Langostinos rebozados en panko", 15200),
        ("Rabas", "Rabas a la romana", 15800),
        ("Nuggets", "Nuggets con salsa de miel mostaza", 11900),
        ("Nachos", "Nachos con cheddar y jalapeños", 12000),
    ],
    "Hamburguesas": [
        ("Americana Simple", "Hamburguesa Americana", 15500),
        ("Americana Doble", "Hamburguesa Americana doble", 18000),
        ("Parrillera Simple", "Hamburguesa Parrillera", 14000),
        ("Parrillera Doble", "Hamburguesa Parrillera doble", 16500),
        ("Clásica Simple", "Hamburguesa Clásica", 13500),
        ("Clásica Doble", "Hamburguesa Clásica doble", 16000),
        ("Royale Simple", "Hamburguesa Royale", 14000),
        ("Royale Doble", "Hamburguesa Royale doble", 16500),
        ("Takisburguer Simple", "Hamburguesa Takis", 15300),
        ("Takisburguer Doble", "Hamburguesa Takis doble", 17800),
    ],
    "Bowls": [
        ("Poke de Pollo Teriyaki", "Base de arroz, pollo marinado en teriyaki, edamame y vegetales", 16000),
        ("Poke de Langostinos", "Base de arroz, langostinos frescos, palta, edamame y salsa ponzu", 17600),
    ],
    "Al Plato": [
        ("Suprema Grillé con Ensalada", "Pechuga de pollo grillada con ensalada fresca", 17400),
        ("Milanesa con Puré", "Milanesa y puré de papas", 17400),
        ("Milanesa Napolitana con Papas", "Milanesa napolitana con papas fritas", 21200),
        ("Bondiola Braseada con Puré de Batata", "Bondiola braseada con puré de batata", 21200),
    ],
    "Pastas": [
        ("Cintas", "Pasta casera cintas", 9600),
        ("Ravioles de Ricota y Verdura", "Ravioles rellenos de ricota y verduras", 12000),
        ("Sorrentinos de Jamón y Queso", "Sorrentinos rellenos de jamón y queso", 14400),
        ("Salsa Filetto", "Salsa a base de tomate", 4200),
        ("Salsa Crema + Tomates Confitados + Pesto", "Salsa cremosa con tomates confitados", 5400),
        ("Salsa Bolognesa", "Salsa a la bolognesa", 6600),
    ],
    "Ensaladas": [
        ("Caesar", "Lechuga romana, pollo, parmesano, croutons y aderezo caesar", 15400),
        ("Cuzco", "Ensalada Cuzco con ingredientes especiales", 16000),
        ("Mediterránea", "Ensalada mediterránea con tomate, mozzarella y aceitunas", 18500),
        ("Anticucha", "Ensalada anticucha con carnes y vegetales", 15500),
        ("Capri", "Tomate, mozzarella fresca, rúcula y aceite de oliva", 17000),
    ],
    "Pizzas Individuales": [
        ("Muzza y Albahaca", "Pizza clásica con mozzarella y albahaca fresca", 11600),
        ("Crudo y Rúcula", "Pizza con jamón crudo y rúcula", 14200),
        ("Hongos y Queso Azul", "Pizza con hongos y queso azul", 14200),
    ],
    "Sandwiches": [
        ("Bacon", "Sándwich con bacon crocante", 17900),
        ("Carne Queso", "Sándwich de carne y queso", 14900),
        ("Criollo", "Sándwich criollo con carnes", 16900),
        ("Parisienne", "Sándwich parisienne", 14900),
        ("Napolitano", "Sándwich napolitano con jamón y queso", 16000),
        ("Pulled Pork", "Sándwich con carne deshilachada", 16000),
        ("Milahuevo", "Sándwich milanesa con huevo frito", 17900),
        ("Bocata de Calamar", "Bocata de calamares fritos", 14900),
        ("Portobellos", "Sándwich con hongos portobello", 16000),
        ("Viet-Ñam", "Sándwich estilo vietnamita", 14900),
    ],
    "Wraps": [
        ("Caesar", "Wrap Caesar con pollo, lechuga y queso sardo", 15400),
        ("Pollo Palta", "Wrap con pollo, palta, tomate y espinaca", 17000),
        ("Tuna Wrap", "Wrap con atún, lechuga y vegetales frescos", 15400),
        ("Ternera", "Wrap con ternera y vegetales asados", 17000),
        ("Hongos", "Wrap vegetariano con hongos y queso", 16000),
    ],
    "Sin TACC / Tartas": [
        ("Tarta de Cabutia", "Tarta sin TACC de cabutia", 14900),
        ("Tarta de Jamón y Queso", "Tarta sin TACC de jamón y queso", 14900),
        ("Tarta de Vegetales", "Tarta sin TACC de vegetales", 14900),
    ],
}

print("[v0] Iniciando carga de 55 productos de delivery...")

# Obtener categorías de delivery
try:
    response = supabase.table("categorias").select("id, nombre").eq("tipo_menu", "delivery").execute()
    cat_ids = {cat["nombre"]: cat["id"] for cat in response.data}
    print(f"[v0] Categorías encontradas: {list(cat_ids.keys())}")
except Exception as e:
    print(f"[ERROR] No se pudieron obtener categorías: {e}")
    sys.exit(1)

# Eliminar productos de delivery existentes
try:
    supabase.table("productos").delete().in_("categoria_id", list(cat_ids.values())).execute()
    print("[v0] Productos de delivery anteriores eliminados")
except Exception as e:
    print(f"[v0] Nota al eliminar: {e}")

# Insertar nuevos productos
total_inserted = 0
for categoria, productos in products_data.items():
    if categoria not in cat_ids:
        print(f"[WARN] Categoría {categoria} no encontrada")
        continue
    
    cat_id = cat_ids[categoria]
    batch = []
    
    for nombre, desc, precio in productos:
        batch.append({
            "nombre": nombre,
            "descripcion": desc,
            "precio": precio,
            "categoria_id": cat_id,
            "disponible": True,
            "destacado": False,
            "imagen_url": None,
            "etiquetas": None,
        })
    
    try:
        response = supabase.table("productos").insert(batch).execute()
        inserted = len(response.data) if response.data else 0
        total_inserted += inserted
        print(f"[v0] {categoria}: {inserted} productos insertados")
    except Exception as e:
        print(f"[ERROR] Error inserting {categoria}: {e}")

print(f"\n[v0] ✓ {total_inserted} productos de delivery cargados exitosamente!")
