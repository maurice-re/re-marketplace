import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/api/logging";

async function getEvents(req: Request, res: Response) {
  const { companyId } = req.query;
  if (req.method == "GET" && typeof companyId == "string") {
    const events = await prisma.event.findMany({
      where: {
        companyId: companyId,
      },
    });
    res.status(200).send({ events: events });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default getEvents;