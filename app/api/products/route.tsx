import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo").default(0),
  categoryId: z.string().cuid("El ID de categoría no es válido"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");
  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as "name" | "price" | "stock" | "createdAt";
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";

  const products = await db.product.findMany({
    where: {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      categoryId: categoryId ?? undefined,
    },
    include: { category: { select: { id: true, name: true } } },
    orderBy: { [sortBy]: sortOrder },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const product = await db.product.create({
    data: result.data,
    include: { category: { select: { id: true, name: true } } },
  });

  return NextResponse.json(product, { status: 201 });
}