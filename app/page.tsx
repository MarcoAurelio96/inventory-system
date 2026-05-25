"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { ProductList } from "@/components/product-list";
import { ProductForm } from "@/components/product-form";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
          <p className="text-slate-500">Gestiona tus productos y stock en tiempo real.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
        >
          {isFormOpen ? "Cerrar Formulario" : "+ Crear Producto"}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Nuevo Producto</h2>
          <ProductForm onSuccess={() => setIsFormOpen(false)} />
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <SearchBar />
        <div className="flex-1">
          <CategoryFilter />
        </div>
      </div>

      <section>
        <ProductList />
      </section>
    </main>
  );
}