![Next](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

# 📝 Sistema de Inventario Profesional
> Gestión avanzada de productos y control de stock en tiempo real con arquitectura escalable.

Aplicación Full-Stack moderna para la gestión eficiente de inventarios, utilizando un enfoque de datos optimista y una arquitectura de componentes desacoplada.

| Despliegue | URL |
|------------|-----|
| Frontend | [Enlace a tu Vercel](https://inventory-system-xi-ten.vercel.app/) |

---

## Características

- **Gestión de Stock en Tiempo Real:** Actualizaciones optimistas con rollback automático ante fallos de servidor.
- **Búsqueda y Filtrado Inteligente:** Filtrado dinámico por categoría y búsqueda optimizada.
- **CRUD Completo:** Gestión integral de productos y categorías.
- **Estado Persistente:** Preferencias de UI (menú lateral) almacenadas localmente.
- **Arquitectura Robusta:** Caché inteligente mediante TanStack Query para reducir llamadas innecesarias al servidor.

---

## Tecnologías

| Frontend | Uso |
|----------|-----|
| Next.js 16 | Framework principal (App Router) |
| TypeScript | Tipado estricto |
| TailwindCSS | Estilizado responsivo |
| TanStack Query | Gestión de estado del servidor |
| Zustand | Estado global y persistencia |

| Backend | Uso |
|---------|-----|
| Prisma ORM | Acceso a base de datos |
| PostgreSQL | Base de datos relacional (Neon) |

| Auxiliares | Uso |
|------------|-----|
| Zod | Validación de esquemas |
| Shadcn/ui | Sistema de componentes UI |
| Vercel | Infraestructura de despliegue |

---

## Estructura del proyecto

```text
inventory-system/
├── app/                  # Rutas y API Endpoints
├── components/           # UI Components (shadcn/ui)
├── hooks/                # Data fetching (TanStack Query)
├── lib/                  # Configuración (db.ts, query-client.ts)
├── prisma/               # Esquemas y migraciones
├── stores/               # Estado global (Zustand)
├── docs/                 # Documentación técnica

*Desarrollado durante las prácticas en [Corner Estudios](https://www.corner-estudios.com) — Marco Aurelio López Cubo — 2026*