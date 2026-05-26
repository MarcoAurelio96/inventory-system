import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/categories", () => {
    return HttpResponse.json([
      { id: "cat-1", name: "Maderas", description: "Maderas nobles" },
      { id: "cat-2", name: "Herrajes", description: "Bisagras y tornillos" },
    ]);
  }),

  http.get("/api/products", () => {
    return HttpResponse.json([
      {
        id: "prod-1",
        name: "Tablón de Roble",
        description: "Madera de roble maciza",
        price: 45.5,
        stock: 15,
        categoryId: "cat-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: { id: "cat-1", name: "Maderas" }
      }
    ]);
  }),
];