import { PrismaClient } from '@prisma/client';
import allProducts from "../../content/products.json";
import allSkus from "../../content/skus.json";
const prisma = new PrismaClient()

async function main() {
  allProducts.map(async (product) => await prisma.product.create({
      data: {
          id: product.id,
          mainImage: product.mainImage,
          materials: product.materials,
          name: product.name,
          sizes: product.sizes
      }
  }))

  allSkus.map(async (sku) => await prisma.sku.create({
      data: {
          id: sku.id,
          mainImage: sku.mainImage,
          material: sku.material,
          materialShort: sku.materialShort,
          price: sku.price,
          productId: sku.productId,
          size: sku.size
      }
  }))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })