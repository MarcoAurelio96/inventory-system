# Gestión de Estado (State Management)

Este documento detalla la estrategia de gestión de estado adoptada en el Sistema de Inventario, diferenciando entre el estado local de la interfaz de usuario (UI) y el estado asíncrono proveniente del servidor, así como el comportamiento de las herramientas elegidas (**Zustand** y **TanStack Query**).

---

## 1. Estado del Servidor vs. Estado de la UI

En aplicaciones modernas, mezclar el estado que pertenece a la base de datos con el estado visual de la aplicación es un antipatrón común que genera inconsistencias y código difícil de mantener. En este proyecto se mantiene una separación estricta:

### Estado del Servidor (Server State)
Es la información que reside permanentemente en la base de datos. El frontend no la posee, sino que la "solicita en préstamo".
* **Características:** Es asíncrono, puede ser modificado por múltiples usuarios simultáneamente y requiere protocolos de red (HTTP/API REST) para leerse o actualizarse.
* **Ejemplos concretos en nuestro inventario:**
  * La lista completa de productos.
  * El stock disponible de un artículo concreto (ej. "Taladro: 10 unidades").
  * El precio de un producto.
  * El listado de categorías disponibles.

### Estado de la UI (UI State)
Es el estado efímero y síncrono que controla exclusivamente el aspecto visual y la experiencia del usuario en el navegador. No altera los registros de la base de datos.
* **Características:** Es instantáneo, no requiere llamadas de red para cambiar y se destruye al cerrar la pestaña a menos que se guarde explícitamente en el navegador.
* **Ejemplos concretos en nuestro inventario:**
  * El texto escrito en la barra de búsqueda (`searchQuery`).
  * Qué filtro de categoría está seleccionado actualmente (`selectedCategoryId`).
  * Si el menú o panel lateral está abierto o colapsado (`sidebarOpen`).
  * Si un formulario modal de creación está visible u oculto.

---

## 2. Zustand y la Persistencia Local (`persist`)

Para gestionar el **Estado de la UI**, se utiliza **Zustand**. El almacén (`src/stores/ui-store.ts`) utiliza el middleware `persist`, que intercepta los cambios del estado y los guarda automáticamente en el `localStorage` del navegador.

### ¿Qué hace el middleware `persist`?
Sincroniza el estado seleccionado de Zustand con el almacenamiento físico del navegador. Cuando el usuario recarga la página (`F5`) o cierra y vuelve a abrir el navegador, Zustand lee el `localStorage` antes de renderizar la pantalla, restaurando la interfaz exactamente como el usuario la dejó.

### ¿Por qué persistir `sidebarOpen` y NO `searchQuery`?
En la configuración del store se implementó la función `partialize`:

## 3. TanStack Query (Estado Servidor)

Gestionamos el estado asíncrono con TanStack Query (caché inteligente).

A. Resiliencia: Actualizaciones Optimistas y Rollback
La UI cambia antes de confirmar con el servidor. Si ocurre un error (ej. 500), ejecutamos un rollback automático usando el snapshot guardado en onMutate.

Prueba de Resiliencia (Simulación 500):
Puedes inyectar un error temporal en src/app/api/products/[id]/stock/route.ts para validar el comportamiento:

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Descomenta para probar el rollback automático
  // return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  
  // ... resto de tu lógica normal
}

B. Ciclo de Vida (React Query DevTools)
Al navegar, observamos los siguientes estados:

* fetching: Petición activa al servidor (/api/products).
* fresh: Datos recientes. Navegación instantánea sin peticiones extra si estamos dentro del staleTime.
* stale: Datos obsoletos. Se realizará un refetch en segundo plano la próxima vez que se requieran.

Comportamiento: Si los datos están fresh, la transición es instantánea. Si están stale, verás un breve estado fetching en DevTools mientras la aplicación se sincroniza en segundo plano, manteniendo la fluidez total para el usuario.

¿Está el formato ahora como lo necesitabas?