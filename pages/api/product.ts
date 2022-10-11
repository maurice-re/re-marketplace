import type { Request, Response } from "express";
import prisma from "../../constants/prisma";


async function handler(req: Request, res: Response) {
  if (req.method == "GET") {
    const products = await prisma.product.findMany();
    res.status(200).send(products);
  }
}

export default handler;
