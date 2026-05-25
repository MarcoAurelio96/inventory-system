import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingCategory = await db.category.findUnique({
      where: { name: result.data.name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: result.data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 });
  }
}