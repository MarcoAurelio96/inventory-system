"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProductMutation, useUpdateProductMutation } from "@/hooks/use-products";
import { useCategoriesQuery } from "@/hooks/use-categories";
import type { Product } from "@prisma/client";

const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().min(0, "No puede ser negativo"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductForm({
  product,
  onSuccess,
}: {
  product?: Product;
  onSuccess?: () => void;
}) {
  const { data: categories, isLoading: loadingCategories } = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product ? Number(product.price) : 0,
      stock: product?.stock || 0,
      categoryId: product?.categoryId || "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (product) {
      const updatePayload = { id: product.id, ...data } as unknown as Partial<Product> & { id: string };
      updateMutation.mutate(updatePayload, { onSuccess });
    } else {
      const createPayload = data as unknown as Partial<Product>;
      createMutation.mutate(createPayload, { onSuccess });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
        <input
          {...register("name")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Categoría</label>
        <select
          {...register("categoryId")}
          disabled={loadingCategories}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Seleccionar categoría...</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Precio</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Stock Inicial</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.stock && <span className="text-xs text-red-500">{errors.stock.message}</span>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Descripción (Opcional)</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
      </button>
    </form>
  );
}