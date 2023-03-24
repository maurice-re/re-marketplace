import type { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function editSettings(req: Request, res: Response) {
  const { locationId, borrowReturnBuffer }: { locationId: string, borrowReturnBuffer: number; } = req.body;
  if (req.method == "POST" && typeof locationId == "string" && borrowReturnBuffer && borrowReturnBuffer > 0) {
    await prisma.settings.update({
      where: {
        locationId: locationId,
      },
      data: {
        borrowReturnBuffer: borrowReturnBuffer,
      },
    });

    res.status(200).send({ success: `Successfully updated tracking settings for ${locationId}` });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default editSettings;