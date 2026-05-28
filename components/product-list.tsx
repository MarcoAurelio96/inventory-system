"use client";

import { useProductsQuery } from "../hooks/use-products";
import { ProductCard } from "./product-card";

export function ProductList() {
  const { data: products, isLoading, isError, refetch } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 w-full animate-pulse rounded-xl bg-slate-200"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-red-50 p-8 text-center text-red-600">
        <p className="mb-4 font-medium">Ocurrió un error al cargar el inventario.</p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-slate-500">
        <p>No se encontraron productos con estos filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}