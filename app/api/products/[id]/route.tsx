import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().cuid().optional(),
});

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data: result.data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await db.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}