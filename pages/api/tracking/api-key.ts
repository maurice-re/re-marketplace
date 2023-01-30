import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { nanoid } from "../../../utils/apiUtils";

async function createApiKey(req: Request, res: Response) {
  // TODO(Suhana): Get rid of this file
  //   if (req.method == "PUT") {
  //     const { companyId } = req.query;
  //     const { admin } : {admin: boolean } = req.body;

  //     if (typeof companyId != "string" || !admin) {
  //         res.status(400).send();
  //         return;
  //     }

  //     await prisma.apiKey.update({
  //         where: {companyId: companyId},
  //         data: {admin: admin}
  //     })
  //     res.status(200).send()
  //   }

  //   if (req.method == "POST") {
  //     const { companyId }: { companyId: string } = req.body;
  //     if (!companyId) {
  //       res.status(400).send();
  //       return;
  //     }

  //     const key = nanoid(64);
  //     await prisma.apiKey.upsert({
  //       where: { companyId: companyId },
  //       update: { id: key },
  //       create: { id: key, companyId: companyId },
  //     });

  //     res.status(200).send({ apiKey: key });
  //   }
}
export default createApiKey;
