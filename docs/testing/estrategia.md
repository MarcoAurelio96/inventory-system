# Estrategia de Testing - Carpintería Los Artesanos

## La Pirámide de Tests

La estrategia de calidad de nuestro inventario se basa en la pirámide de tests. Dividimos las pruebas en tres niveles dependiendo de su velocidad de ejecución, coste de mantenimiento y nivel de confianza.

### 1. Tests Unitarios (Base de la pirámide)
Son pruebas extremadamente rápidas y aisladas que verifican piezas minúsculas del código (funciones puras). 
* **Ejemplo en el taller:** Evaluar la función `formatPrice` para garantizar que si introducimos el precio del "Tablón de Roble Macizo" (45.50), la función devuelva exactamente la cadena "45,50 €". También se probaría la función `isLowStock` para confirmar que devuelve `true` si el stock del "Barniz Poliuretano Satinado" cae por debajo de las 10 unidades.

### 2. Tests de Integración (Medio de la pirámide)
Comprueban cómo interactúan dos o más piezas del sistema juntas, como por ejemplo un componente de React con una llamada a la API interceptada.
* **Ejemplo en el taller:** Renderizar el componente `ProductList` y usar MSW para simular que el servidor responde con los datos de la "Bisagra de Cazoleta 35mm". El test comprobará que el componente dibuja la tarjeta de la bisagra correctamente en la interfaz sin haber tocado la base de datos de Neon.

### 3. Tests End-to-End o E2E (Cúspide de la pirámide)
Simulan a un usuario humano abriendo un navegador de verdad, haciendo clics y esperando resultados. Son lentos, pero ofrecen la máxima garantía de funcionamiento.
* **Ejemplo en el taller:** Un robot (Playwright) abre la web, hace clic en "Crear Producto", rellena el formulario indicando "Tablero MDF Estándar 18mm", selecciona la categoría "Derivados de la Madera", guarda, hace clic en la pestaña de esa categoría y verifica visualmente que el tablero aparece listado y no aparecen productos de la categoría "Herrajes".

---

## Ciclo de vida de los tests (Hooks de configuración)

Para que los tests sean fiables, necesitan ejecutarse en un entorno limpio. Para controlar esto, Vitest nos proporciona cuatro funciones clave:

* **`beforeAll`**: Se ejecuta **una sola vez**, justo antes de que empiece a correr el primer test del archivo. Lo usamos para preparar el terreno global (por ejemplo, encender el servidor simulado de MSW). Es el equivalente a abrir el taller por la mañana y encender la luz.
* **`beforeEach`**: Se ejecuta **justo antes de cada uno** de los tests individualmente. Se utiliza para preparar datos específicos antes de una prueba concreta (por ejemplo, reiniciar el carrito a cero).
* **`afterEach`**: Se ejecuta **justo después de cada uno** de los tests. Es vital para limpiar el entorno y evitar que un test contamine al siguiente. En nuestro proyecto lo usamos para resetear los manejadores de MSW (es como barrer el serrín de la mesa de trabajo después de cada corte).
* **`afterAll`**: Se ejecuta **una sola vez**, al terminar absolutamente todos los tests del archivo. Se usa para la limpieza final (por ejemplo, apagar el servidor simulado de MSW). Es el equivalente a cerrar el taller al final del día.