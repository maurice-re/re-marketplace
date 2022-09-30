import type { Request, Response } from "express";
import prisma from "../../constants/prisma";


async function handler(req: Request, res: Response) {
  const now = new Date();
  if (req.method == "POST") {
    res.status(200).send()
  }

  if (req.method == "DELETE") {
    await prisma.orderItem.deleteMany();
    res.status(200).send();
  }
}

export default handler;
