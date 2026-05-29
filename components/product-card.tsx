"use client";

import { useUpdateStockMutation } from "../hooks/use-products";
import type { Product } from "@prisma/client";

type ProductWithCategory = Product & { category: { id: string; name: string } };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { mutate: updateStock } = useUpdateStockMutation();

  const handleIncrement = () => {
    updateStock({ productId: product.id, stock: product.stock + 1 });
  };

  return (
    <div data-testid="product-card" className="border p-5 rounded-xl shadow-sm bg-white">
      <h3 className="font-semibold text-slate-900">{product.name}</h3>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-800">
          Stock: <span data-testid="product-stock">{product.stock}</span>
        </span>
        
        <button 
          onClick={handleIncrement} 
          className="h-8 w-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100"
        >
          +
        </button>
      </div>
    </div>
  );
}