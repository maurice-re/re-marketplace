import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/api/logging";

async function updateSettings(req: Request, res: Response) {
  const { companyId, borrowReturnBuffer }: { companyId: string, borrowReturnBuffer: number; } = req.body;
  if (req.method == "POST" && typeof companyId == "string" && borrowReturnBuffer && borrowReturnBuffer > 0) {
    console.log("In post with ", companyId, ' ', borrowReturnBuffer);

    await prisma.settings.update({
      where: {
        companyId: companyId,
      },
      data: {
        borrowReturnBuffer: borrowReturnBuffer,
      },
    });

    // const company = await prisma.company.findUnique({
    //   where: {
    //     id: companyId,
    //   },
    // });

    res.status(200).send({ success: `Successfully updated tracking settings for ${companyId} ` });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default updateSettings;