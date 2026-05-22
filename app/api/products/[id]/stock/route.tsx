import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateStockSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
});

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params; 
    
    const body = await request.json();
    const result = updateStockSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Stock inválido", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: { id: id },
      data: { stock: result.data.stock },
      include: { category: { select: { id: true, name: true } } },
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ ERROR REAL EN EL SERVIDOR:", error);
    return NextResponse.json({ error: "Producto no encontrado o error interno" }, { status: 404 });
  }
}