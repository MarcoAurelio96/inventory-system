import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { ProductList } from "@/components/product-list";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
          <p className="text-slate-500">Gestiona tus productos y stock en tiempo real.</p>
        </div>
      </div>

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