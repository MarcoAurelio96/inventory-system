# Pruebas de Integración en el Backend

En este documento detallamos nuestra estrategia para probar las rutas de la API de Next.js (App Router), la diferencia fundamental con las pruebas unitarias y las herramientas específicas que hemos elegido para nuestro entorno serverless.

## Tests Unitarios vs. Tests de Integración

Para asegurar la calidad de nuestro inventario de carpintería, usamos diferentes enfoques de testing dependiendo de lo que queramos comprobar:

### Test Unitario (Aislamiento total)
Un test unitario prueba una sola pieza de código (generalmente una función) de forma totalmente aislada. 
* **Ejemplo en el taller:** Comprobar que nuestra función `calculateDiscount(precio, porcentaje)` funciona. Si le pasamos el precio de un "Tablero de Roble" (100€) y un descuento del 20%, la función debe devolver `80`. No interactúa con bases de datos ni con la red.

### Test de Integración (Trabajo en equipo)
Un test de integración verifica que varias piezas del sistema funcionan correctamente cuando se unen.
* **Ejemplo en el taller:** Probar la ruta completa `POST /api/products`. Este test comprueba que la ruta recibe los datos, que la librería **Zod** los valida correctamente (rechazando precios negativos), que **Prisma** se conecta a la base de datos de test (Neon), inserta el registro real y que, finalmente, el servidor devuelve un código HTTP `201 Created`. Estamos probando el engranaje completo del backend.

---

## El desafío de probar Next.js API Routes

Históricamente, en el ecosistema de Node.js (con frameworks como Express), la herramienta estándar para hacer tests de integración de APIs ha sido **Supertest**. Sin embargo, en nuestro proyecto **no podemos usar Supertest directamente**.

### ¿Por qué Supertest no es compatible?
Supertest está diseñado para conectarse a un servidor HTTP tradicional que se queda "escuchando" en un puerto (ej. `localhost:3000`). 
Las rutas de API de Next.js (App Router) no funcionan así; son **funciones Serverless** que utilizan los estándares web modernos (`Request` y `Response`). Al no levantar un servidor tradicional de Node.js, Supertest no tiene a dónde conectarse durante la ejecución rápida de los tests con Vitest. Levantar un servidor completo de Next.js solo para pasar los tests sería extremadamente lento y pesado.

### La solución: `next-test-api-route-handler`
Para resolver este problema de arquitectura, utilizamos la librería `next-test-api-route-handler`. 

**¿Qué hace exactamente?**
En lugar de levantar un servidor falso o requerir puertos abiertos, esta herramienta actúa como un simulador de entorno (un "mock" del motor de Next.js). 
1. Toma nuestro archivo de ruta real (`route.tsx`).
2. Construye un objeto `Request` estándar de la Web API con los datos que le pasamos en el test.
3. Inyecta esa petición directamente en nuestra función `GET`, `POST` o `PATCH`.
4. Captura el objeto `Response` que devuelve nuestra función para que podamos evaluar el `status` y el `body` (JSON).

Gracias a esta herramienta, podemos ejecutar tests de integración contra una base de datos real a la velocidad del rayo, respetando la arquitectura Serverless y los estándares web de Next.js.