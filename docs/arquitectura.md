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

---

## 2. Diagrama de Arquitectura del Sistema

El siguiente diagrama representa el flujo de datos y la separación de responsabilidades en la aplicación:

### 1. Descripción del Modelo de Datos
El sistema gestiona el inventario mediante una relación **1 a Muchos (1:N)** entre las entidades `Category` (Categorías) y `Product` (Productos):
* Una **Categoría** puede agrupar múltiples productos. El campo `name` es único (`@unique`) para evitar duplicidades organizacionales.
* Un **Producto** pertenece obligatoriamente a una única categoría mediante la clave foránea `categoryId`.
* **Regla de Integridad Referencial:** Se ha configurado `onDelete: Restrict`. Esto impide por completo que un usuario borre una categoría si todavía existen productos asociados a ella, protegiendo al sistema de dejar productos "huérfanos" sin categoría.

### 2. Justificación Técnica: Decimal vs Float para Precios
En el modelo de `Product`, el campo `price` se ha definido explícitamente como `Decimal(10, 2)` (10 dígitos en total, 2 decimales) en lugar de usar `Float`.

**El problema numérico en programación (IEEE 754):**
Los tipos `Float` y `Double` son tipos de datos de "coma flotante binaria". Las computadoras representan estos números en base 2, lo que significa que no pueden representar con exactitud fracciones decimales comunes como `0.1`, `0.2` o `0.7`. 
Si sumamos repetidamente precios usando `Float`, el sistema acumulará sutiles errores de redondeo (por ejemplo, `0.1 + 0.2` podría resultar en `0.30000000000000004`).

**Impacto real en un Inventario:**
* **Descuadres financieros:** En un inventario con miles de productos y movimientos de stock, estos micro-errores de redondeo se magnifican, provocando que el valor total del inventario o los totales de las facturas no cuadren con la contabilidad real.
* **Auditorías:** Las aplicaciones comerciales y bancarias exigen precisión exacta. `Decimal` almacena los números de forma exacta (similar a una cadena de texto estructurada), garantizando que las operaciones matemáticas con dinero sean 100% predecibles y seguras.

### 3. Infraestructura en la Nube: DATABASE_URL vs DIRECT_URL
Neon, al ser una base de datos Serverless, nos exige separar las estrategias de conexión según el caso de uso:

| Variable | Tipo de Conexión | Caso de Uso Principal | ¿Por qué se usa? |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Pooled** (Con Pooler) | Servidor de Next.js (API / Componentes) | Reutiliza conexiones para evitar saturar la base de datos con miles de peticiones serverless concurrentes. |
| `DIRECT_URL` | **Direct** (Directa) | Migraciones de Prisma (`migrate dev`) | Conexión directa y persistente requerida para modificar la estructura de las tablas sin interferencias del gestor de pool. |



#### ¿Por qué el servidor de Next.js necesita Connection Pooling (`DATABASE_URL`)?
En las arquitecturas modernas en la nube (como Next.js en Vercel), las funciones del servidor se ejecutan de forma "serverless". Esto significa que cada vez que un usuario entra a la web, se puede levantar una micro-instancia del servidor que se apaga a los pocos segundos. 
Si cada micro-instancia abriera una conexión directa a PostgreSQL, el límite de conexiones de la base de datos se agotaría en minutos, tirando el sistema. El *Connection Pooling* (gestionado por herramientas como PgBouncer en Neon) mantiene un grupo fijo de conexiones abiertas y las "presta" a las peticiones de Next.js de forma ultra-veloz, optimizando los recursos.

#### ¿Por qué las migraciones necesitan Conexión Directa (`DIRECT_URL`)?
El comando `prisma migrate dev` necesita alterar la estructura de la base de datos (crear tablas, cambiar columnas). Estas operaciones de infraestructura requieren comandos de larga duración y bloqueos exclusivos a nivel de base de datos. Los gestores de *pooling* suelen romper estas transacciones complejas porque están diseñados para consultas web rápidas de lectura/escritura, no para alterar la arquitectura del motor.