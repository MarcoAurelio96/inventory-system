"use client";

import { useCategoriesQuery, useDeleteCategoryMutation } from "@/hooks/use-categories";
import { useUIStore } from "@/stores/ui-store";

export function CategoryFilter() {
  const { data: categories, isLoading } = useCategoriesQuery();
  const { selectedCategoryId, selectCategory } = useUIStore();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    
    if (window.confirm(`¿Estás seguro de que quieres borrar la categoría "${name}"?`)) {
      deleteCategory(id, {
        onError: (error) => alert(error.message)
      });
      
      if (selectedCategoryId === id) {
        selectCategory(null);
      }
    }
  };

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
        <div key={category.id} className="relative flex items-center group">
          <button
            onClick={() => selectCategory(category.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors pr-8 ${
              selectedCategoryId === category.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {category.name}
          </button>
          
          <button
            onClick={(e) => handleDelete(e, category.id, category.name)}
            disabled={isDeleting}
            className="absolute right-2 text-slate-400 hover:text-red-500 disabled:opacity-50"
            title="Borrar categoría"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}