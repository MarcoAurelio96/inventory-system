import type { Product } from "@/types/product.ts";

export function filterProducts(products: Product[], query: string): Product[] {
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter((product) => 
    product.name.toLowerCase().includes(lowerQuery)
  );
}

export function sortProducts(
  products: Product[],
  sortBy: keyof Product,
  sortOrder: "asc" | "desc"
): Product[] {
  return [...products].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}

export function isLowStock(product: Product, threshold: number): boolean {
  return product.stock < threshold;
}


export function formatPrice(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} €`;
}