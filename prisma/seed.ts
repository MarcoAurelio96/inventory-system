import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando la siembra de datos...')

  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const electronica = await prisma.category.create({
    data: { name: 'Electrónica', description: 'Dispositivos y gadgets' },
  })

  const ropa = await prisma.category.create({
    data: { name: 'Ropa', description: 'Prendas de vestir y moda' },
  })

  const oficina = await prisma.category.create({
    data: { name: 'Oficina', description: 'Material escolar y de trabajo' },
  })

  await prisma.product.createMany({
    data: [
      { name: 'Portátil Gaming', price: 1200.50, stock: 15, categoryId: electronica.id },
      { name: 'Smartphone 5G', price: 899.99, stock: 30, categoryId: electronica.id },
      { name: 'Auriculares Inalámbricos', price: 59.99, stock: 50, categoryId: electronica.id },

      { name: 'Camiseta de Algodón', price: 15.99, stock: 100, categoryId: ropa.id },
      { name: 'Pantalón Vaquero', price: 45.00, stock: 40, categoryId: ropa.id },
      { name: 'Chaqueta de Invierno', price: 89.95, stock: 20, categoryId: ropa.id },

      { name: 'Cuaderno A4', price: 5.50, stock: 200, categoryId: oficina.id },
      { name: 'Bolígrafo Azul', price: 1.20, stock: 500, categoryId: oficina.id },
      { name: 'Silla Ergonómica', price: 150.00, stock: 10, categoryId: oficina.id },
    ],
  })

  console.log('✅ ¡Base de datos sembrada con éxito!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })