import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function getSettings(req: Request, res: Response) {
  const { locationId } = req.query;
  if (req.method == "GET" && typeof locationId == "string") {
    const settings = await prisma.settings.findUnique({
      where: {
        locationId: locationId,
      },
    });
    res.status(200).send({ settings: settings });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default getSettings;