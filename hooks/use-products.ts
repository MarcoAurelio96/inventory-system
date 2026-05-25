import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/stores/ui-store";
import type { Product } from "@prisma/client";

type ProductWithCategory = Product & { category: { id: string; name: string } };

export function useProductsQuery() {
  const { searchQuery, selectedCategoryId, sortBy, sortOrder } = useUIStore();

  return useQuery({
    queryKey: ["products", { searchQuery, selectedCategoryId, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar los productos");
      return res.json() as Promise<ProductWithCategory[]>;
    },
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Error al crear el producto");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar el producto");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar el producto");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, stock }: { productId: string; stock: number }) => {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error("Error al actualizar el stock");
      return res.json();
    },
    
    onMutate: async ({ productId, stock }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const snapshot = queryClient.getQueriesData({ queryKey: ["products"] });
      
      queryClient.setQueriesData<ProductWithCategory[]>({ queryKey: ["products"] }, (old) =>
        old?.map((p) => (p.id === productId ? { ...p, stock } : p)) ?? []
      );
      
      return { snapshot };
    },
    onError: (_err, _vars, context) => {
     
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}