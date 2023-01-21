import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/api/logging";

async function editEvents(req: Request, res: Response) {
  if (req.method == "POST") {
    const updateEvents = await prisma.event.updateMany({
      where: {
        skuId: "",
      },
      data: {
        skuId: null,
      },
    });
    res.status(200).send("Done updating!");
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default editEvents;