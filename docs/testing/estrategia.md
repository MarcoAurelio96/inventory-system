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

---

## Estrategia de Mocking con MSW (Mock Service Worker)

En este proyecto utilizamos **MSW (Mock Service Worker)** para simular las respuestas de nuestra API durante los tests de integración, en lugar de mockear directamente las librerías de cliente (como `axios` o `fetch`).

### ¿Por qué MSW es superior a hacer `vi.mock('axios')`?

La diferencia fundamental radica en **la capa en la que ocurre la intercepción** y el nivel de acoplamiento de nuestros tests:

* **Con `vi.mock('axios')` (Mocking de librería):**
    Estamos reemplazando el código de la herramienta que usamos para pedir los datos. El test se limita a comprobar detalles de implementación, como: *"¿Se ha llamado a la función axios.get con la URL correcta?"*.
    * **El gran problema:** Si el día de mañana decidimos cambiar `axios` por el `fetch` nativo de JavaScript, **todos nuestros tests se romperían en rojo**. Tendríamos que reescribir las pruebas enteras, a pesar de que la aplicación web seguiría funcionando perfectamente para el usuario final. 

* **Con MSW (Mocking a nivel de red):**
    Dejamos que nuestro componente de React (y React Query) ejecuten su código real. MSW actúa como un "guardia de tráfico" invisible que intercepta la petición HTTP real justo antes de que salga al exterior y le devuelve la respuesta falsa.
    * **La gran ventaja:** Si cambiamos nuestra librería de fetching en el futuro, **los tests seguirán pasando en verde** intactos. Al test no le importa *qué* herramienta uses para pedir los datos, solo le importa la petición HTTP final.

### ¿Qué diferencia hay en lo que se está testeando?

* **Mock clásico (`vi.mock`)**: Testea el **cómo** (los detalles de implementación internos de tu código).
* **MSW**: Testea el **qué** (la integración real). Comprueba exactamente lo mismo que experimentará el usuario: *"¿Cómo reacciona la interfaz de usuario cuando el servidor le devuelve este JSON o cuando hay un fallo de red?"*. Esto nos otorga una confianza total de que el código funcionará en producción.