import type { Request, Response } from "express";
import prisma from "../../constants/prisma";


async function handler(req: Request, res: Response) {
  const now = new Date();
  if (req.method == "POST") {
    res.status(200).send()
  }

  if (req.method == "DELETE") {
    await prisma.order.deleteMany({where: {companyId: "cl84l784n0000ub0otwisauiv"}});
    res.status(200).send();
  }
}

export default handler;
