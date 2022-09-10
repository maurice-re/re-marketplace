import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


export default async function resetAll(req: Request, res: Response) {
  await prisma.account.deleteMany({});
  await prisma.apiLogging.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.sku.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.untrackedInventory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  res.status(200).send
}
