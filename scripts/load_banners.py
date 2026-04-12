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

# Banners a crear/actualizar
banners_data = [
    {
        "titulo": "TRABAJA CON NOSOTROS",
        "subtitulo": "Unite al equipo",
        "descripcion": "Somos una empresa comprometida con la excelencia en gastronomía",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-12-taTa8KD6rEoCJrbQVZhry1Z2d7C5wg.jpg",
        "texto_boton": "Ver oportunidades",
        "link_boton": "/trabajos",
        "pagina": "inicio",
        "orden": 5,
        "activo": True,
    },
    {
        "titulo": "CONTACTO",
        "subtitulo": "¡Hablemos!",
        "descripcion": "Nos encantaría conocer tus comentarios y sugerencias",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-13-WKAIDE69MnYmj4zPVNsZSZPtWNSz5t.jpg",
        "texto_boton": "Contactar",
        "link_boton": "/contacto",
        "pagina": "inicio",
        "orden": 6,
        "activo": True,
    },
    {
        "titulo": "RESERVÁ TU MESA",
        "subtitulo": "Asegura tu lugar",
        "descripcion": "Elegí la mesa ideal, seleccioná fecha y horario, y aseguró tu lugar en CRUMBS.",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-11-fkyPTUbjLyWyNrlPzcPrBM1sXwEkfp.jpg",
        "texto_boton": "Reservar",
        "link_boton": "/reservas",
        "pagina": "cocina",
        "orden": 1,
        "activo": True,
    },
    {
        "titulo": "DELIVERY",
        "subtitulo": "Llega a tu casa",
        "descripcion": "Disfrutá de nuestros mejores platos desde la comodidad de tu hogar",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-09-8ZPN7xJIi5isDMpXujGgD4ld9pdTuf.jpg",
        "texto_boton": "Pedir ahora",
        "link_boton": "/delivery",
        "pagina": "inicio",
        "orden": 2,
        "activo": True,
    },
    {
        "titulo": "ALMUERZO & CENA",
        "subtitulo": "Nuestras especialidades",
        "descripcion": "Descubrí los mejores platos para almuerzo y cena",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-08-oGfWdGdC5R7LvlPcAASGXvMbsNC8gX.jpg",
        "texto_boton": "Ver menú",
        "link_boton": "/cocina",
        "pagina": "cocina",
        "orden": 2,
        "activo": True,
    },
    {
        "titulo": "CAFETERÍA",
        "subtitulo": "Café y más",
        "descripcion": "Desayunos, meriendas y mucho más en nuestro espacio de cafetería",
        "imagen_url": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-10-AlxorkL1rSXH2JjCa4QjrUZ6qzMP2G.jpg",
        "texto_boton": "Ir a cafetería",
        "link_boton": "/cafeteria",
        "pagina": "cafeteria",
        "orden": 1,
        "activo": True,
    },
]

print("[v0] Cargando banners...")

# Primero obtener todos los banners existentes para actualizar por título
existing_banners = supabase.table("banners").select("id, titulo").execute().data or []
existing_dict = {b["titulo"]: b["id"] for b in existing_banners}

created = 0
updated = 0

for banner in banners_data:
    titulo = banner["titulo"]
    
    if titulo in existing_dict:
        # Actualizar existente
        banner_id = existing_dict[titulo]
        response = supabase.table("banners").update(banner).eq("id", banner_id).execute()
        print(f"[v0] Actualizado: {titulo}")
        updated += 1
    else:
        # Crear nuevo
        response = supabase.table("banners").insert(banner).execute()
        print(f"[v0] Creado: {titulo}")
        created += 1

print(f"\n[v0] ✓ Proceso completado!")
print(f"[v0] Creados: {created}, Actualizados: {updated}")
