## 1. Introducción
Esta documentación detalla la implementación de pruebas End-to-End (E2E) para la gestión de productos, utilizando **Playwright**. El objetivo es validar la integridad funcional de la aplicación web, enfocándose en la interacción del usuario con los componentes de gestión de stock.

## 2. Arquitectura de Pruebas
La estrategia de pruebas se basa en el **Page Object Model (POM)** y el uso de **Data Test IDs** para asegurar selectores estables y desacoplados del diseño visual.

### Conceptos Clave
- **E2E Testing:** Valida el flujo completo de la aplicación (Frontend -> API -> Base de Datos -> Frontend).
- **Auto-waiting:** Playwright gestiona automáticamente la espera de elementos, reduciendo el "flakiness" en componentes asíncronos.
- **Polling (Expect.poll):** Técnica utilizada para consultar el estado del DOM de forma recurrente ante actualizaciones asíncronas de React Query.

## 3. Implementación del Componente (Resumen)
El componente `ProductCard` fue optimizado para permitir pruebas estables mediante la inclusión de identificadores únicos:

```tsx
<div data-testid="product-card">
  <span data-testid="product-stock">{product.stock}</span>
  <button onClick={handleIncrement}>+</button>
</div>