Este documento describe la arquitectura técnica de nuestra aplicación de sistema de inventario utilizando **Next.js (App Router)**. Aquí explicamos cómo se estructuran las capas del sistema y por qué este framework moderno cambia el paradigma de desarrollo tradicional.

---

## 1. Diagrama de Arquitectura del Sistema

El siguiente diagrama representa el flujo de datos y la separación de responsabilidades en la aplicación:

```text
+-----------------------------------------------------------------+
|                    CAPA DE CLIENTE (Navegador)                  |
|                                                                 |
|  - Client Components (React): Interactividad inmediata          |
|  - Interfaz de usuario (Sidebar colapsable, Formularios, Sheet) |
|  - Gestión de estado local (useState, useEffect)                |
+-----------------------------------------------------------------+
                                |
                                | Solicitudes HTTP (Fetch / Server Actions)
                                v
+-----------------------------------------------------------------+
|            SISTEMA UNIFICADO NEXT.JS (Entorno de Servidor)      |
|                                                                 |
|  [Capa de Renderizado]                                          |
|   - React Server Components (RSC): Renderizan HTML en servidor  |
|                                                                 |
|  [Capa de API / Controladores]                                  |
|   - Route Handlers (src/app/api/...): Endpoints HTTP nativos     |
|   - Server Actions: Funciones asíncronas ejecutadas en servidor |
+-----------------------------------------------------------------+
                                |
                                | Consultas (ORM / SQL Directo)
                                v
+-----------------------------------------------------------------+
|                     CAPA DE BASE DE DATOS                       |
|                                                                 |
|  - Almacenamiento Persistente (Base de datos del sistema)      |
|  - Modelos de Datos: Productos, Categorías, Historial de Stock   |
+-----------------------------------------------------------------+