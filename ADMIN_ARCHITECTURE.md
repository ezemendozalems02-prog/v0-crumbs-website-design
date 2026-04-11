# Arquitectura Robusta del Panel de Admin - IMPLEMENTADA

## Estado: ✅ COMPLETAMENTE FUNCIONAL

La arquitectura está implementada y lista. Este documento describe cómo mantenerla escalable.

---

## Arquitectura en 4 Capas

### 1. TYPES LAYER (Sin "use server")
**Archivo:** `lib/admin-{entity}-types.ts`

Tipos, interfaces y constantes compartidas. Importable desde cualquier lugar.

```typescript
// lib/admin-banners-types.ts
export type Banner = { ... }
export type BannerInput = { ... }
export const PAGINAS_OPCIONES = [...]
```

---

### 2. SERVER LAYER (Con "use server")
**Archivo:** `lib/admin-{entity}.ts`

Solo funciones async. NUNCA exporta tipos o constantes.

```typescript
"use server"
import type { Banner, BannerInput } from "@/lib/admin-banners-types"

export async function getBanners(): Promise<Banner[]> { ... }
export async function createBanner(input: BannerInput) { ... }
```

---

### 3. CLIENT COMPONENTS
**Archivo:** `components/admin/{entity}-form-modal.tsx`

```typescript
"use client"
import { createBanner } from "@/lib/admin-banners"
import type { Banner } from "@/lib/admin-banners-types"

export function BannerFormModal() { ... }
```

**Importa:** tipos desde TYPES, funciones desde SERVER

---

### 4. SERVER PAGES
**Archivo:** `app/admin/{entity}/page.tsx`

```typescript
import { getBanners } from "@/lib/admin-banners"
import type { Banner } from "@/lib/admin-banners-types"
import { BannerFormModal } from "@/components/admin/banner-form-modal"

export default async function Page() { ... }
```

**Sin "use client"** por defecto = Server Component

---

## Diagrama de Flujo

```
TYPES LAYER (sin directiva)
    ↑ ↑ ↑
    ├─ PAGES (importan tipos + funciones + components)
    ├─ COMPONENTS (importan tipos + funciones)
    └─ SERVER (importa solo tipos)
```

---

## Checklist: Agregar Nueva Sección en 5 Pasos

### 1. TYPES
```bash
touch lib/admin-{entity}-types.ts
```
```typescript
export type Entity = { id: string; nombre: string }
export type EntityInput = { nombre: string }
export const OPTIONS = [{ value: "a", label: "A" }]
```

### 2. SERVER
```bash
touch lib/admin-{entity}.ts
```
```typescript
"use server"
import type { Entity, EntityInput } from "@/lib/admin-{entity}-types"

export async function getEntities(): Promise<Entity[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("{entity}").select("*")
  return data ?? []
}

export async function createEntity(input: EntityInput) { ... }
export async function updateEntity(id: string, input: Partial<EntityInput>) { ... }
export async function deleteEntity(id: string) { ... }
```

### 3. MODAL COMPONENT
```bash
touch components/admin/{entity}-form-modal.tsx
```
```typescript
"use client"
import { createEntity } from "@/lib/admin-{entity}"
import type { Entity, EntityInput } from "@/lib/admin-{entity}-types"

export function EntityFormModal({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState<EntityInput>({ nombre: "" })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await createEntity(form)
    if (result.success) onSaved()
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### 4. PAGE
```bash
mkdir -p app/admin/{entity}
touch app/admin/{entity}/page.tsx
```
```typescript
import { getEntities, deleteEntity } from "@/lib/admin-{entity}"
import type { Entity } from "@/lib/admin-{entity}-types"
import { EntityFormModal } from "@/components/admin/{entity}-form-modal"

export default async function EntityPage() {
  const entities = await getEntities()
  
  return (
    <div>
      <EntityFormModal onSaved={() => {}} />
      {entities.map(e => <div key={e.id}>{e.nombre}</div>)}
    </div>
  )
}
```

### 5. SIDEBAR
```typescript
// components/admin/admin-sidebar.tsx
const navItems = [
  // ... existing items
  { href: "/admin/{entity}", label: "Entity", icon: IconComponent },
]
```

---

## Archivos Implementados Actualmente

### Banners (Completo)
- ✅ `lib/admin-banners-types.ts`
- ✅ `lib/admin-banners.ts`
- ✅ `components/admin/banner-form-modal.tsx`
- ✅ `app/admin/banners/page.tsx`

### Secciones (Completo)
- ✅ `lib/admin-secciones-types.ts`
- ✅ `lib/admin-secciones.ts`
- ✅ `components/admin/seccion-form-modal.tsx`
- ✅ `app/admin/secciones/page.tsx`

### Sidebar (Actualizado)
- ✅ `components/admin/admin-sidebar.tsx` con items de banners y secciones

---

## Reglas Críticas (NUNCA HACER)

1. ❌ Importar archivo "use server" en Client Component
   ```typescript
   // MAL
   import { Banner } from "@/lib/admin-banners" // ← error
   ```

2. ❌ Agregar "use server" a archivo de types
   ```typescript
   // MAL
   "use server"
   export type Banner = { ... } // ← no tiene sentido
   ```

3. ❌ Exportar tipos desde SERVER layer
   ```typescript
   // MAL
   export type { Banner } // ← debe estar en types layer
   ```

4. ❌ Circular imports
   ```typescript
   // MAL: types → server, server → types
   ```

---

## Ventajas de Esta Arquitectura

✅ **Clear Boundaries** - Cada capa tiene una responsabilidad única
✅ **TypeScript Safe** - Errores en tipos se detectan en compilación
✅ **Escalable** - Agregar 10 secciones = 10 veces el mismo pattern
✅ **No Surprises** - Siempre sabes dónde buscar qué cosa
✅ **Next.js Compliant** - Respeta todas las reglas de boundaries

---

## Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| "Cannot use Server-only feature" | Importaste `admin-*.ts` en Client Component | Importa desde `admin-*-types.ts` |
| "Property does not exist" | Tipo faltante o incorrecto | Verifica que el tipo esté en `*-types.ts` |
| Build fails "Cannot find module" | Archivo no existe | Revisa que creaste todos los 5 archivos |
| Infinite loop / weird errors | Circular dependency | Verifica imports - debe ir en una dirección |

---

## Resumen

El panel admin funciona con una arquitectura de 4 capas: TYPES (tipos compartidos) → SERVER (funciones) → COMPONENTS (UI) → PAGES (vistas).

Cada nueva sección solo necesita 5 archivos siguiendo el mismo patrón, sin posibilidad de romper la aplicación si se respeta la arquitectura.
