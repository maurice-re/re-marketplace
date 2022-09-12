import { Company, EventType, Sku, UntrackedInventory } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/api/logging";

async function createEvent(req: Request, res: Response) {
    // Check API Key Format
  const { authorization } = req.headers;
  if (!authorization || !authorization?.startsWith("Apikey")) {
    console.log(authorization);
    logApi("create-event", false, "Invalid API key format");
    res.status(401).send("Invalid API key format");
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
    console.log(apiWithCompany);
    logApi("create-event", false, "Unauthorized access");
    res.status(401).send("Unauthorized access/API key invalid");
    return;
  }

  // Get request info
  const {
    consumerId,
    itemId,
    locationId,
    skuId,
    type
  }: {
    consumerId: string;
    itemId: string;
    locationId: string;
    skuId: string | undefined;
    type: EventType;
  } = req.body;

  const company = apiWithCompany.company;

  if (company == undefined) {
    res.status(400).send("API Key invalid/outdated");
    logApi(type.toLowerCase(), false, "API Key Invalid/outdated")
    return;
  }
  const skus = await prisma.sku.findMany();

  const sku: Sku | undefined = authorization.startsWith("Apikey re_")
    ?  skus.find(sku => sku.id == "TODO")
    :  skus.find(sku => sku.id == skuId);


    if (sku == undefined) {
        res.status(400).send("Sku ID field undefined or invalid")
        return;
    }

  await prisma.event.create({
    data: {
      companyId: company.id,
      consumerId: consumerId,
      itemId: itemId,
      skuId: sku!.id,
      trackingLocation: locationId,
      type: type,
    },
  });
  res.status(200).send("Successfully tracked event");
  // updateUntracked(itemId, company, sku!.id);
  logApi(type.toLowerCase())
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
