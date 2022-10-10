import type { Request, Response } from "express";
import prisma from "../../constants/prisma";


async function handler(req: Request, res: Response) {
  if (req.method == "GET") {
    const skus = await prisma.sku.findMany();
    res.status(200).send(skus);
  }
}

export default handler;
