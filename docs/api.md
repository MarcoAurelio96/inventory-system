Documentación de la API (Endpoints)

Esta API RESTful gestiona las entidades principales del Sistema de Inventario: Categorías y Productos. Todas las respuestas y peticiones utilizan el formato application/json.

1. Endpoints de Categorías (/api/categories)

Listar todas las categorías

Método: GET

Ruta: /api/categories

Respuesta Exitosa (200 OK): Array de objetos categoría, ordenados alfabéticamente.

Errores: 500 Internal Server Error (Fallo de base de datos).

Crear una categoría

Método: POST

Ruta: /api/categories

Cuerpo Esperado (JSON):

{
  "name": "Ferretería",
  "description": "Herramientas"
}


Respuesta Exitosa (201 Created): Objeto de la categoría creada.

Errores:

400 Bad Request: Faltan datos obligatorios o formato inválido.

409 Conflict: Ya existe una categoría con ese nombre exacto.

Actualizar una categoría

Método: PATCH

Ruta: /api/categories/[id]

Cuerpo Esperado (JSON): Cualquier combinación de name y/o description.

Respuesta Exitosa (200 OK): Objeto de la categoría actualizada.

Errores:

400 Bad Request: Datos inválidos.

404 Not Found: ID inexistente.

Eliminar una categoría

Método: DELETE

Ruta: /api/categories/[id]

Respuesta Exitosa (204 No Content): Sin cuerpo en la respuesta.

Errores:

404 Not Found: ID inexistente.

409 Conflict: La categoría tiene productos asociados y la restricción referencial de la base de datos impide su borrado.


2. Endpoints de Productos (/api/products)

Listar productos (con filtros)

Método: GET

Ruta: /api/products

Parámetros de consulta (Query Params) opcionales:

search: Filtra por nombre (insensible a mayúsculas/minúsculas).

categoryId: Filtra por ID de categoría.

sortBy: Campo de ordenación (name, price, stock, createdAt). Por defecto: createdAt.

sortOrder: Dirección (asc, desc). Por defecto: desc.

Respuesta Exitosa (200 OK): Array de productos con la información básica de su categoría anidada.

Crear un producto

Método: POST

Ruta: /api/products

Cuerpo Esperado (JSON):

{
  "name": "Taladro",
  "description": "Taladro percutor",
  "price": 45.99,
  "stock": 10,
  "categoryId": "cuid_de_la_categoria"
}


Respuesta Exitosa (201 Created): Objeto del producto creado.

Errores:

400 Bad Request: Validación de Zod fallida.

Actualizar datos generales de un producto

Método: PATCH

Ruta: /api/products/[id]

Cuerpo Esperado (JSON): Campos administrativos opcionales (name, description, price, categoryId). No incluye la modificación directa de la cantidad de stock.

Respuesta Exitosa (200 OK): Producto actualizado.

Errores:

400 Bad Request: Datos inválidos.

404 Not Found: Producto no encontrado.

Eliminar un producto

Método: DELETE

Ruta: /api/products/[id]

Respuesta Exitosa (204 No Content): Sin cuerpo en la respuesta.

Errores:

404 Not Found: Producto no encontrado.


3. Operaciones Críticas: Endpoint de Stock

Actualizar exclusivamente el inventario

Método: PATCH

Ruta: /api/products/[id]/stock

Cuerpo Esperado (JSON):

{
  "stock": 15
}


Respuesta Exitosa (200 OK): Objeto del producto con el stock actualizado reflejado.

Errores:

400 Bad Request: Si se intenta enviar stock negativo.

404 Not Found: Producto no encontrado.


4. Decisiones de Arquitectura: Separación del Endpoint de Stock

Protección de Datos Administrativos: Modificar los metadatos de un producto (nombre, precio o categoría) es una tarea administrativa. Por el contrario, modificar el stock es la operación más frecuente del sistema. Separar las rutas garantiza que al actualizar las unidades disponibles, no se pueda alterar por accidente el precio o el nombre del artículo.

Validaciones Estrictas: El esquema de actualización general del producto configura sus campos de forma opcional. En cambio, el esquema dedicado al stock exige obligatoriamente que el campo stock esté presente y que no admita valores negativos, bloqueando que se corrompa el inventario.

Optimización de Red: Para operaciones rápidas de suma o resta, el cliente solo necesita transmitir un objeto JSON minúsculo ({ "stock": N }). Esto agiliza la velocidad de los endpoints en tiempo real.