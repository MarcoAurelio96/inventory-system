import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100).optional(),
  description: z.string().optional(),
});

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const category = await db.category.update({
      where: { id },
      data: result.data,
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    
    const productsCount = await db.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return NextResponse.json({ error: "No se puede eliminar la categoría porque tiene productos asociados" }, { status: 409 });
    }

    await db.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
}