import { Action, Sku } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function createEvent(req: Request, res: Response) {
  //Check method
  if (req.method != "POST") {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
    return;
  }
  // Check API Key Format
  const { authorization } = req.headers;
  if (!authorization || !authorization?.startsWith("Bearer")) {
    await logApi("create-event", false, `Missing or Invalid API key: ${authorization}`);
    res.status(401).send("Invalid API key format");
    return;
  }

  // Get request info
  const {
    companyId,
    consumerId,
    itemId,
    locationId,
    skuId,
    action,
    timestamp
  }: {
    companyId: string;
    action: Action;
    consumerId: string;
    itemId: string;
    locationId: string;
    skuId: string;
    timestamp: string;
  } = req.body;

  const company = await prisma.company.findUnique({
    where: {
      id: companyId
    },
  });

  if (company == undefined) {
    await logApi(action, false, "Company invalid/outdated");
    res.status(400).send("Company invalid/outdated");
    return;
  }

  if (skuId !== "") {
    // TODO: HANDLE RE MADE QR CODES
    const skus: Sku[] = await prisma.sku.findMany();
    const sku: Sku | undefined = authorization.startsWith("Bearer re_")
      ? skus.find(sku => sku.id == "TODO")
      : skus.find(sku => sku.id == skuId);
    if (!sku) {
      await logApi(action, false, "skuId invalid");
      res.status(400).send("skuId invalid");
      return;
    }
  }

  if (company !== undefined) {
    await prisma.event.create({
      data: {
        action: action,
        companyId: companyId,
        consumerId: consumerId === "" ? null : consumerId,
        itemId: itemId === "" ? null : itemId,
        skuId: skuId === "" ? null : skuId,
        locationId: locationId,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      },
    });
  } else {
    await logApi(action, false, "Company invalid/outdated");
    res.status(400).send("Company invalid/outdated");
  }

  await logApi(action.toLowerCase());
  res.status(200).send({ success: `Successfully tracked ${itemId}.` });
  // updateUntracked(itemId, company, sku!.id);
}

export default createEvent;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO: Implement
// async function updateUntracked(
//   itemId: string,
//   company: Company & { untracked: UntrackedInventory[]; },
//   skuId: string
// ): Promise<void> {
//   const numEvents = await prisma.event.count({
//     where: {
//       itemId: itemId,
//     },
//   });

//   if (numEvents == 1) {
//     const untracked = company.untracked.find((data) => data.skuId == skuId);
//     if (!untracked) {
//       return;
//     }

//     if (untracked.quantity == 1) {
//       await prisma.untrackedInventory.delete({
//         where: {
//           companyId_skuId: { companyId: company.id, skuId: skuId },
//         },
//       });
//     }
//     await prisma.untrackedInventory.update({
//       where: {
//         companyId_skuId: { companyId: company.id, skuId: skuId },
//       },
//       data: {
//         quantity: untracked.quantity - 1,
//       },
//     });
//   }
// }
