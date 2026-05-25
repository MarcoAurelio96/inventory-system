import { useQuery } from "@tanstack/react-query";
import type { Category } from "@prisma/client";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Error al cargar las categorías");
      return res.json() as Promise<Category[]>;
    },
    staleTime: 1000 * 60 * 60, 
  });
}