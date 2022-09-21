import { Action, Company, Sku, UntrackedInventory } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/api/logging";

async function createEvent(req: Request, res: Response) {

  //Check method
  if (req.method != "POST") {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported")
    res.status(401).send("Bad Request")
  } 
    // Check API Key Format
  const { authorization } = req.headers;
  if (!authorization || !authorization?.startsWith("Bearer")) {
    await logApi("create-event", false, `Missing or Invalid API key: ${authorization}`);
    res.status(401).send(`Invalid API key format`);
    return;
  }
  
  // Get company with locations and untracked inventory
  // If company doesn't exist API key is invalid so send that
  const apiWithCompany = await prisma.apiKey.findFirst({
    where: {
      id: authorization.slice(7)
    },
    include: {
      company: {
        include: {
          locations: true,
          untracked: true
        }
      }
    }
  })

  if (!apiWithCompany || apiWithCompany.company == undefined) {
    await logApi("create-event", false, `Unauthorized access/API key invalid: ${JSON.stringify(apiWithCompany)}`);
    res.status(401).send(`Unauthorized access/API key invalid: ${JSON.stringify(apiWithCompany)}`);
    return;
  }

  // Get request info
  const {
    consumerId,
    itemId,
    locationId,
    skuId,
    action
  }: {
    action: Action;
    consumerId: string;
    itemId: string;
    locationId: string;
    skuId: string | undefined;
  } = req.body;

  const company = apiWithCompany.company;

  if (company == undefined) {
    await logApi(action, false, "API Key Invalid/outdated")
    res.status(400).send("API Key invalid/outdated");
    return;
  }
  const skus = await prisma.sku.findMany();

  // TODO: HANDLE RE MADE QR CODES
  const sku: Sku | undefined = authorization.startsWith("Bearer re_")
    ?  skus.find(sku => sku.id == "TODO")
    :  skus.find(sku => sku.id == skuId);

  if (company !== undefined && sku !== undefined) {
    await prisma.event.create({
      data: {
        action: action,
        companyId: company.id,
        consumerId: consumerId,
        itemId: itemId,
        skuId: sku?.id,
        trackingLocation: locationId,
      },
    });
  } else {
    await logApi(action, false, "Company/Sku invalid/outdated")
    res.status(400).send("Company/Sku invalid/outdated");
  }

  await logApi(action.toLowerCase())
  res.status(200).send({success: `successfully tracked ${itemId}`});
  // updateUntracked(itemId, company, sku!.id);
}

export default createEvent;

async function updateUntracked(
  itemId: string,
  company: Company & { untracked: UntrackedInventory[] },
  skuId: string
): Promise<void> {
  const numEvents = await prisma.event.count({
    where: {
      itemId: itemId,
    },
  });

  if (numEvents == 1) {
    const untracked = company.untracked.find((data) => data.skuId == skuId)!;

    if (untracked.quantity == 1) {
      await prisma.untrackedInventory.delete({
        where: {
          companyId_skuId: { companyId: company.id, skuId: skuId },
        },
      });
    }
    await prisma.untrackedInventory.update({
      where: {
        companyId_skuId: { companyId: company.id, skuId: skuId },
      },
      data: {
        quantity: untracked.quantity - 1,
      },
    });
  }
}
