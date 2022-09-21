import { PrismaClient, Role, SubscriptionType, Type } from '@prisma/client';
import allProducts from "./products.json";
import { getSkusFromProduct } from './seedUtils';

const prisma = new PrismaClient()

async function main() {

  allProducts.map(async (product) => await prisma.product.upsert({
    where: {id: product.id}, update: product, create: product
}))

getSkusFromProduct(allProducts).map(async (sku) => await prisma.sku.upsert({
  where: {id: sku.id}, update: sku, create: sku
}))

  const now = new Date();

  const testCompany = {
    id: "616",
    createdAt: now,
    customerId: "cus_M9eeBtGCJfNxeZ",
    name: "S.H.I.E.L.D.",
    subscriptionType: SubscriptionType.FREE
  }
  const shield = await prisma.company.upsert({ 
    where: {id: "616"}, update: testCompany, create: testCompany 
  })

  const testAdmin = {
    companyId: testCompany.id,     
    createdAt: now,
    email: "pcoulson@myyahoo.com",
    firstName: "Phil",
    lastName: "Coulson",
    role: Role.ADMIN,
  }
  const phil = await prisma.user.upsert({
    where: {email: "pcoulson@myyahoo.com"}, update: testAdmin, create: testAdmin
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
    line1: "219 W 47th St",
    shippingName: "S.H.I.E.L.D",
    state: "New York",
    userId: phil.id.toString(),
    zip: "10036",
    type: Type.SHIPPING
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
    line1: "3250 Catlin Ave",
    shippingName: "S.H.I.E.L.D",
    state: "Virginia",
    userId: phil.id,
    zip: "22134",
    type: Type.SHIPPING
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
      skuId: "SB21.5RPPG",
      transactionId: "616",
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
    skuId: "SB21RPPW",
    transactionId: "616",
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
    skuId: "SB21.5RPPG",
    transactionId: "616",
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