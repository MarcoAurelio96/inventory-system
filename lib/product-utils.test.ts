import { describe, it, expect } from "vitest";
import { filterProducts, isLowStock, formatPrice, sortProducts } from "./product-utils";
import { Product } from "@prisma/client";

const mockProducts = [
  { id: "1", name: "Tablero roble macizo 40 mm", price: 89.5, stock: 4, categoryId: "cat-maderas", createdAt: "2024-01-01" },
  { id: "2", name: "Bisagra cazoleta 35 mm", price: 2.4, stock: 0, categoryId: "cat-herrajes", createdAt: "2024-01-02" },
  { id: "3", name: "Barniz mate incoloro 1 L", price: 18.75, stock: 22, categoryId: "cat-acabados", createdAt: "2024-01-03" },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

describe("filterProducts", () => {
  it("devuelve todos los productos con searchQuery vacío", () => {
    expect(filterProducts(mockProducts, "")).toHaveLength(3);
  });

  it("filtra por nombre de forma insensible a mayúsculas", () => {
    const result = filterProducts(mockProducts, "bisagra");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("devuelve array vacío cuando no hay coincidencias", () => {
    expect(filterProducts(mockProducts, "taladro")).toHaveLength(0);
  });

  it("devuelve array vacío con array de entrada vacío", () => {
    expect(filterProducts([], "roble")).toHaveLength(0);
  });

  it("no devuelve filas si se busca una categoría que no está en el nombre del producto", () => {
    expect(filterProducts(mockProducts, "herrajes")).toHaveLength(0);
  });
});

describe("isLowStock", () => {
  it("devuelve true cuando el stock está por debajo del umbral", () => {
    expect(isLowStock(mockProducts[0], 10)).toBe(true);
  });

  it("devuelve true cuando el stock es exactamente cero", () => {
    expect(isLowStock(mockProducts[1], 5)).toBe(true);
  });

  it("devuelve false cuando el stock supera el umbral", () => {
    expect(isLowStock(mockProducts[2], 10)).toBe(false);
  });

  it("verifica el comportamiento cuando el umbral es 0 (devuelve false porque 0 no es estrictamente menor que 0)", () => {
    expect(isLowStock(mockProducts[1], 0)).toBe(false);
  });
});

describe("formatPrice", () => {
  it("formatea el precio con símbolo de euro y dos decimales", () => {
    expect(formatPrice(89.5)).toBe("89,50 €");
  });

  it("maneja correctamente los precios con cero céntimos", () => {
    expect(formatPrice(20)).toBe("20,00 €");
  });
});

describe("sortProducts", () => {
  it("ordena los productos por precio de forma ascendente", () => {
    const result = sortProducts(mockProducts, "price", "asc");
    expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
    expect(result[2].name).toBe("Tablero roble macizo 40 mm");
  });

  it("ordena los productos por stock de forma descendente", () => {
    const result = sortProducts(mockProducts, "stock", "desc");
    expect(result[0].name).toBe("Barniz mate incoloro 1 L");
    expect(result[2].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("invierte correctamente el resultado al ordenar por precio de forma descendente", () => {
    const result = sortProducts(mockProducts, "price", "desc");
    expect(result[0].name).toBe("Tablero roble macizo 40 mm");
    expect(result[2].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("mantiene el orden si dos productos tienen exactamente el mismo valor", () => {
    const mockTies = [
      { name: "Producto A", price: 10 },
      { name: "Producto B", price: 10 }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
    
    const result = sortProducts(mockTies, "price", "asc");
    expect(result[0].name).toBe("Producto A");
    expect(result[1].name).toBe("Producto B");
  });
});