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

print("[v0] Loading banners into Supabase...")

# Define banners with correct structure
banners = [
    {
        "titulo": "TRABAJA CON NOSOTROS",
        "subtitulo": "",
        "descripcion": "Únete a nuestro equipo",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-12-taTa8KD6rEoCJrbQVZhry1Z2d7C5wg.jpg",
        "boton_texto": "Conoce más",
        "boton_link": "#",
        "pagina": "inicio",
        "activo": True,
        "orden": 1,
    },
    {
        "titulo": "CONTACTO",
        "subtitulo": "",
        "descripcion": "¿Consultas o sugerencias? Escribinos",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-13-WKAIDE69MnYmj4zPVNsZSZPtWNSz5t.jpg",
        "boton_texto": "Contactar",
        "boton_link": "#",
        "pagina": "inicio",
        "activo": True,
        "orden": 2,
    },
    {
        "titulo": "RESERVÁ TU MESA",
        "subtitulo": "Elegí la mesa ideal, seleccioná fecha y horario, y aseguará tu lugar en CRUMBS.",
        "descripcion": "",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-11-fkyPTUbjLyWyNrlPzcPrBM1sXwEkfp.jpg",
        "boton_texto": "Reservar",
        "boton_link": "#",
        "pagina": "inicio",
        "activo": True,
        "orden": 3,
    },
    {
        "titulo": "DELIVERY",
        "subtitulo": "",
        "descripcion": "Pida desde casa",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-09-8ZPN7xJIi5isDMpXujGgD4ld9pdTuf.jpg",
        "boton_texto": "Ver menu",
        "boton_link": "/delivery",
        "pagina": "inicio",
        "activo": True,
        "orden": 4,
    },
    {
        "titulo": "ALMUERZO & CENA",
        "subtitulo": "",
        "descripcion": "Nuestro menú completo",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-08-oGfWdGdC5R7LvlPcAASGXvMbsNC8gX.jpg",
        "boton_texto": "Ver menu",
        "boton_link": "/carta",
        "pagina": "inicio",
        "activo": True,
        "orden": 5,
    },
    {
        "titulo": "CAFETERÍA",
        "subtitulo": "",
        "descripcion": "Desayunos & café",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-10-AlxorkL1rSXH2JjCa4QjrUZ6qzMP2G.jpg",
        "boton_texto": "Ver menu",
        "boton_link": "/cafeteria",
        "pagina": "cafeteria",
        "activo": True,
        "orden": 1,
    },
]

# Delete existing banners for these pages
try:
    supabase.table("banners").delete().in_("pagina", ["inicio", "cafeteria"]).execute()
    print("[v0] Deleted existing banners")
except Exception as e:
    print(f"[WARNING] Delete error: {e}")

# Insert new banners
for i, banner in enumerate(banners):
    try:
        response = supabase.table("banners").insert(banner).execute()
        if response.data:
            print(f"[v0] ✓ Banner {i+1}: {banner['titulo']}")
        else:
            print(f"[ERROR] Failed to insert banner {i+1}: {banner['titulo']}")
    except Exception as e:
        print(f"[ERROR] Insert error for banner {i+1}: {e}")

print(f"\n[v0] ✓ All {len(banners)} banners loaded successfully!")
