"use client";

import { useUpdateStockMutation } from "@/hooks/use-products";
import type { Product } from "@prisma/client";

type ProductWithCategory = Product & { category: { id: string; name: string } };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { mutate: updateStock, isPending } = useUpdateStockMutation();

  const handleIncrement = () => {
    updateStock({ productId: product.id, stock: product.stock + 1 });
  };

  const handleDecrement = () => {
    if (product.stock > 0) {
      updateStock({ productId: product.id, stock: product.stock - 1 });
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="font-semibold text-slate-900">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
        <span className="inline-block rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {product.category.name}
        </span>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
          {product.description || "Sin descripción disponible."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Stock actual</span>
          <span className={`text-lg font-bold ${product.stock === 0 ? "text-red-500" : "text-slate-800"}`}>
            {product.stock}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={product.stock === 0 || isPending}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
          >
            -
          </button>
          <button
            onClick={handleIncrement}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}