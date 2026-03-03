# Kadmiel CRM — Claude Code Guide

## Project Overview

**Kadmiel CRM** is a sales pipeline management application built for the **REVERSA** sales methodology. It provides a Kanban-style board for managing sales prospects (`prospectos`) across 10 pipeline stages.

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Backend / Auth / DB:** Supabase (`@supabase/ssr` + `@supabase/supabase-js`)
- **Drag & Drop:** `@hello-pangea/dnd`
- **Icons:** `lucide-react`
- **Dev port:** `3008`

---

## Development Commands

```bash
npm run dev       # Start development server at http://localhost:3008
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout wrapping all pages with AppShell
    page.tsx                # Root redirect
    globals.css             # Global styles and CSS variables
    dashboard/page.tsx      # Dashboard with pipeline stats
    prospectos/page.tsx     # Kanban board (main pipeline view)
    login/page.tsx          # Auth page
  components/
    AppShell.tsx            # Sidebar navigation shell
    ProspectModal.tsx       # Create/edit prospect modal
    StageGateCheck.tsx      # Stage transition checklist modal
  lib/
    types.ts                # All shared types, enums, and constants (ETAPAS, SUCURSALES, etc.)
    hooks/useCurrentUser.ts # Hook for current user role and sucursal
    supabase/
      client.ts             # Browser Supabase client
      server.ts             # Server-side Supabase client
      middleware.ts         # Session refresh middleware
  middleware.ts             # Next.js middleware for auth (runs on all routes)
```

---

## Key Domain Concepts

### Pipeline Stages (`EtapaProspecto`)

The REVERSA methodology defines 10 stages in order:

| ID | Label | Default probability |
|---|---|---|
| `nuevo` | Nuevo | 5% |
| `primer_contacto` | Primer contacto | 15% |
| `descubrimiento` | Descubrimiento | 25% |
| `entendimos_dolor` | Entendimos su dolor | 40% |
| `le_conviene` | Le conviene | 55% |
| `quien_decide` | Quién decide | 65% |
| `le_mostramos` | Le mostramos | 75% |
| `cerrando` | Cerrando | 85% |
| `ganado` | ¡Ganado! | 100% |
| `perdido` | Perdido | 0% |

### Prospect Fields (`Prospecto`)

Key fields beyond basic contact info:
- `etapa` — current pipeline stage
- `valor_estimado` — estimated deal value in MXN
- `prioridad` — `alta` | `media` | `baja`
- `sucursal` — branch: `Teran`, `San Cristobal`, or `Aeropuerto`
- `asignado_a` — UUID of the assigned admin user
- `dolor_principal` — the prospect's main pain point
- `probabilidad` — deal probability (0-100)
- `posicion` — order within the column

### User Roles

- **Super admin (`isSuper`):** Can see all sucursales, assign to any user
- **Regular admin:** Scoped to their own `sucursal`

Role and sucursal are fetched via the `useCurrentUser` hook (`src/lib/hooks/useCurrentUser.ts`).

### Supabase Tables / RPCs

- `crm_prospectos` — main prospects table
- `get_admin_users()` — RPC returning list of admin users with `user_id`, `full_name`, `email`, `role`, `sucursal`

---

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Coding Conventions

- All UI text is in **Spanish** (the app's language)
- Currency is formatted in **MXN** using `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`
- Dates use `es-MX` locale
- Stage/type constants live in `src/lib/types.ts` — add new ones there
- Supabase client in browser components: `import { createClient } from '@/lib/supabase/client'`
- Supabase client in Server Components / Route Handlers: `import { createClient } from '@/lib/supabase/server'`
- Path alias `@/` maps to `src/`

---

## Linting

ESLint with `eslint-config-next` (core-web-vitals + TypeScript rules). Run:

```bash
npm run lint
```
