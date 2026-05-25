"use client";

import { useCategoriesQuery } from "@/hooks/use-categories";
import { useUIStore } from "@/stores/ui-store";

export function CategoryFilter() {
  const { data: categories, isLoading } = useCategoriesQuery();
  const { selectedCategoryId, selectCategory } = useUIStore();

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-slate-200"></div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => selectCategory(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selectedCategoryId === null
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Todas
      </button>
      {categories?.map((category) => (
        <button
          key={category.id}
          onClick={() => selectCategory(category.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategoryId === category.id
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}