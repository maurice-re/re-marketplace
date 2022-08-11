import { PrismaClient, Role } from '@prisma/client';
import allProducts from "../../content/products.json";
import allSkus from "../../content/skus.json";

const prisma = new PrismaClient()

async function main() {

  allProducts.map(async (product) => await prisma.product.upsert({
    where: {id: product.id}, update: product, create: product
}))

allSkus.map(async (sku) => await prisma.sku.upsert({
  where: {id: sku.id}, update: sku, create: sku
}))

  const now = new Date();

  const testCompany = {
    id: "616",
    createdAt: now,
    customerId: "cus_M9eeBtGCJfNxeZ",
    name: "S.H.I.E.L.D.",
  }
  const shield = await prisma.company.upsert({ 
    where: {id: "616"}, update: testCompany, create: testCompany 
  })

  const testAdmin = {
    companyId: testCompany.id,     
    createdAt: now,
    email: "pcoulson@shield.com",
    firstName: "Phil",
    lastName: "Coulson",
    role: Role.ADMIN,
  }
  const phil = await prisma.user.upsert({
    where: {email: "pcoulson@shield.com"}, update: testAdmin, create: testAdmin
  })

  const testTransaction = {
    id: "616",
    amount: 20000,
    companyId: testCompany.id,
    createdAt: now,
    userId: phil.id
  }
  const transaction = await prisma.transaction.upsert({
    where: {id: "616"}, update: testTransaction, create: testTransaction
  })

  const testLocation1 = {
    id: "219",
    city: "New York",
    country: "United States",
    companyId: testCompany.id,
    displayName: "Headquarters",
    lastOrderDate: now,
    line1: "219 W 47th St",
    shippingName: "S.H.I.E.L.D",
    state: "New York",
    userId: phil.id.toString(),
    zip: "10036"
  }
  const Headquarters = await prisma.location.upsert({
    where: {id: "219"}, update: testLocation1, create: testLocation1
  })
  
  const testLocation2 = {
    id: "3250",
    city: "Quantico",
    country: "United States",
    companyId: testCompany.id,
    displayName: "Playground",
    lastOrderDate: now,
    line1: "3250 Catlin Ave",
    shippingName: "S.H.I.E.L.D",
    state: "Virginia",
    userId: phil.id,
    zip: "22134"
  }
  const playground = await prisma.location.upsert({
    where: {id: "3250"}, update: testLocation2, create: testLocation2
  })

  const testOrder1 = {
      id: "00001",
      amount: 10000,
      companyId: testCompany.id,
      createdAt: now,
      locationId: Headquarters.id,
      quantity: 1000,
      skuId: "RE-SB2-1.5L-RPP-D",
      transactionId: transaction.id,
      userId: phil.id
  }
  await prisma.order.upsert({
    where: {id: "00001"}, update: testOrder1, create: testOrder1
  })
  
  const testOrder2 = {
    id: "00002",
    amount: 5000,
    companyId: testCompany.id,
    createdAt: now,
    locationId: Headquarters.id,
    quantity: 500,
    skuId: "RE-SB2-1L-RPP-D",
    transactionId: transaction.id,
    userId: phil.id
  }
  await prisma.order.upsert({
    where: {id: "00002"}, update: testOrder2, create: testOrder2
  })

  const testOrder3 = {
    id: "00003",
    amount: 5000,
    companyId: testCompany.id,
    createdAt: now,
    locationId: playground.id,
    quantity: 500,
    skuId: "RE-SB2-1.5L-RPP-D",
    transactionId: transaction.id,
    userId: phil.id
  }
  await prisma.order.upsert({
    where: {id: "00003"}, update: testOrder3, create: testOrder3
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })