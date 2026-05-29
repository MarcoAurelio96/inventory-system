import { describe, it, expect, beforeEach } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import { db } from "../../lib/db";
import * as productsHandler from "../../app/api/products/route";
import * as categoriesHandler from "../../app/api/categories/route";
import * as stockHandler from "../../app/api/products/[id]/stock/route"; 

beforeEach(async () => {
  await db.product.deleteMany({ where: { name: { startsWith: "Test-" } } });
  
  await db.category.upsert({
    where: { id: "test-category" },
    update: {},
    create: {
      id: "test-category",
      name: "Categoría de Prueba",
      description: "Categoría creada para tests de integración"
    }
  });
});

describe("GET /api/categories", () => {
  it("devuelve 200 y un array de categorías", async () => {
    await testApiHandler({
      appHandler: categoriesHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
      },
    });
  });
});

describe("GET /api/products", () => {
  it("devuelve 200 con un array", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
      },
    });
  });

  it("cada producto tiene el esquema correcto (id, name, price, stock, category)", async () => {
    await db.product.create({
      data: { name: "Test-Esquema", price: 10, stock: 5, categoryId: "test-category" }
    });

    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        const body = await res.json();
        
        expect(body.length).toBeGreaterThan(0);
        const product = body[0];
        
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("stock");
        expect(product).toHaveProperty("category");
      },
    });
  });
});

describe("POST /api/products", () => {
  it("crea un producto y devuelve 201", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-Listón pino 50x50",
            price: 4.2,
            stock: 20,
            categoryId: "test-category", 
          }),
        });
        expect(res.status).toBe(201);
      },
    });
  });

  it("devuelve 400 si el precio es negativo", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test-X", price: -10, categoryId: "test-category" }),
        });
        expect(res.status).toBe(400);
      },
    });
  });
});

describe("PATCH /api/products/[id]/stock", () => {
  it("stock válido devuelve 200 y actualiza el valor", async () => {
    const p = await db.product.create({
      data: { name: "Test-Patch-Stock", price: 10, stock: 5, categoryId: "test-category" }
    });

    await testApiHandler({
      appHandler: stockHandler,
      params: { id: p.id },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: 50 }),
        });
        expect(res.status).toBe(200);
      },
    });
  });

  it("id inexistente devuelve 404", async () => {
    await testApiHandler({
      appHandler: stockHandler,
      params: { id: "un-id-que-no-existe-123" },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: 50 }),
        });
        expect(res.status).toBe(404);
      },
    });
  });

  it("stock negativo devuelve 400", async () => {
    const p = await db.product.create({
      data: { name: "Test-Stock-Negativo", price: 10, stock: 5, categoryId: "test-category" }
    });

    await testApiHandler({
      appHandler: stockHandler,
      params: { id: p.id },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: -10 }), 
        });
        expect(res.status).toBe(400);
      },
    });
  });
});