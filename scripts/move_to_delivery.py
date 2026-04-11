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

client = create_client(url, key)

print("[v0] Obteniendo todas las categorías...")
cats = client.table("categorias").select("id, nombre, tipo_menu").execute().data or []

delivery_cats = {c["id"]: c for c in cats if c["tipo_menu"] == "delivery"}
cart_cats = {c["id"]: c for c in cats if c["tipo_menu"] in ["desayuno", "almuerzo_cena"]}

print(f"[v0] Categorías delivery: {len(delivery_cats)}")
print(f"[v0] Categorías carta: {len(cart_cats)}")

# Productos de delivery que están en categorías de carta
print("\n[v0] Buscando productos de delivery en categorías de carta...")

# Lista de nombres que deben estar en delivery
delivery_names = {
    "papas fritas": True, "papas a caballo": True, "papas bar": True, "quesadillas de pollo": True,
    "quesadillas 4 quesos": True, "mini burritos de pollo (x3)": True, "tequeños": True,
    "empanadas de vacío y provoleta (x3)": True, "langostinos en panko": True, "rabas": True,
    "nuggets": True, "nachos": True, "americana simple": True, "americana doble": True,
    "parrillera simple": True, "parrillera doble": True, "clásica simple": True, "clásica doble": True,
    "royale simple": True, "royale doble": True, "takisburguer simple": True, "takisburguer doble": True,
    "poke de pollo teriyaki": True, "poke de langostinos": True, "suprema grillé con ensalada": True,
    "milanesa con puré": True, "milanesa napolitana con papas": True, "bondiola braseada con puré de batata": True,
    "cintas": True, "ravioles de ricota y verdura": True, "sorrentinos de jamón y queso": True,
    "salsa filetto": True, "salsa crema + tomates confitados + pesto": True, "salsa bolognesa": True,
    "caesar": True, "cuzco": True, "mediterránea": True, "anticucha": True, "capri": True,
    "muzza y albahaca": True, "crudo y rúcula": True, "hongos y queso azul": True,
    "bacon": True, "carne queso": True, "criollo": True, "parisienne": True, "napolitano": True,
    "pulled pork": True, "milahuevo": True, "bocata de calamar": True, "portobellos": True, "viet-ñam": True,
    "caesar wrap": True, "pollo palta": True, "tuna wrap": True, "ternera": True, "hongos": True,
    "tarta de cabutia": True, "tarta de jamón y queso": True, "tarta de vegetales": True
}

all_prods = client.table("productos").select("id, nombre, categoria_id").execute().data or []

moved = 0
for prod in all_prods:
    name = prod["nombre"].strip().lower()
    
    # Si está en delivery_names y está en carta, moverlo a delivery
    if name in delivery_names and prod["categoria_id"] in cart_cats:
        # Obtener la categoría de delivery correspondiente
        # Para simplificar, lo movemos a la primera categoría de delivery (Entradas)
        delivery_cat_id = next(iter(delivery_cats.keys())) if delivery_cats else None
        
        if delivery_cat_id:
            try:
                client.table("productos").update({"categoria_id": delivery_cat_id}).eq("id", prod["id"]).execute()
                print(f"[v0] Movido a delivery: {prod['nombre']}")
                moved += 1
            except Exception as e:
                print(f"[v0] Error al mover {prod['nombre']}: {e}")

print(f"\n[v0] ✓ Completado - {moved} productos movidos a delivery")
