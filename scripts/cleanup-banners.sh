#!/bin/bash
# Script para limpiar referencias de banners y secciones del proyecto

echo "🧹 Iniciando limpieza de referencias de banners y secciones..."

# Variables
PROJECT_DIR="/vercel/share/v0-project"
FILES_TO_CHECK=(
  "$PROJECT_DIR/app/admin/banners"
  "$PROJECT_DIR/app/admin/secciones"
  "$PROJECT_DIR/lib/admin-banners.ts"
  "$PROJECT_DIR/lib/admin-secciones.ts"
  "$PROJECT_DIR/components/admin/banner-form-modal.tsx"
  "$PROJECT_DIR/components/admin/seccion-form-modal.tsx"
  "$PROJECT_DIR/scripts/create-banners-tables.sql"
  "$PROJECT_DIR/v0_plans/admin-banners-secciones.md"
)

# Eliminar archivos y carpetas
for file in "${FILES_TO_CHECK[@]}"; do
  if [ -e "$file" ]; then
    echo "✓ Eliminando: $file"
    rm -rf "$file"
  else
    echo "✗ No encontrado: $file"
  fi
done

echo ""
echo "✓ Búsqueda de referencias residuales en código..."
grep -r "banner\|seccion" "$PROJECT_DIR" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  2>/dev/null | grep -i "admin-banner\|admin-seccion" || echo "✓ No hay referencias residuales"

echo ""
echo "✅ Limpieza completada"
