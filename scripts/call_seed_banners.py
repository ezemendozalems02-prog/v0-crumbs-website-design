import os
import subprocess
import time

# Esperar a que el servidor esté listo
print("[v0] Esperando que el servidor de desarrollo esté listo...")
time.sleep(5)

# Llamar la ruta API
import urllib.request
import json

url = "http://localhost:3000/api/admin/banners/seed"

try:
    print(f"[v0] Llamando {url}...")
    with urllib.request.urlopen(urllib.request.Request(url, method='POST')) as response:
        data = json.loads(response.read().decode())
        print(f"[v0] Response: {data}")
        if data.get('success'):
            print(f"[v0] ✓ {data.get('message')}")
        else:
            print(f"[v0] Error: {data.get('error')}")
except Exception as e:
    print(f"[v0] Error: {e}")
    print("[v0] Intenta llamar manualmente: http://localhost:3000/api/admin/banners/seed")
