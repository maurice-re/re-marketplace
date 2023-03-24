import type { Request, Response } from "express";
import { ApiError } from "next/dist/server/api-utils";
import { prisma } from "../../constants/prisma";

async function handler(req: Request, res: Response) {
    const { locationId } = req.query;
  if (req.method == "GET" && typeof locationId == "string") {
    try {
      const events = await prisma.event.findMany({where: {locationId: locationId}
      });
      res.status(200).send({ events: events });
    } catch (e) {
      const error = e as ApiError;
      res
        .status(500)
        .send({ error: "Error creating hardware " + error.message });
      return;
    }
  }
}
export default handler;
