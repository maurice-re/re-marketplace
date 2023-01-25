import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function getSettings(req: Request, res: Response) {
  const { companyId } = req.query;
  if (req.method == "GET" && typeof companyId == "string") {
    const settings = await prisma.settings.findUnique({
      where: {
        companyId: companyId,
      },
    });
    res.status(200).send({ settings: settings });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default getSettings;