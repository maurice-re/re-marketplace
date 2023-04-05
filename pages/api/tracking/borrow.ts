import { Action, Company, Hardware, SubscriptionType } from "@prisma/client";
import type { Request, Response } from "express";
import { FullHardware } from "../../../app/server-store";
import { prisma } from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function borrow(req: Request, res: Response) {
  // Check Request Method
  if (req.method != "POST") {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported.");
    res.status(401).send("Bad Request");
  }
  // Check API Key Format
  const { authorization } = req.headers;
  if (!authorization || !authorization?.startsWith("Bearer")) {
    await logApi("borrow", false, `Missing or Invalid API key: ${authorization}.`);
    res.status(401).send(`Invalid API key format.`);
    return;
  }

  // Get request info
  const {
    hardwareId,
    consumerId,
    itemId,
    skuId,
    timestamp
  }: {
    hardwareId: string;
    consumerId: string;
    itemId: string;
    skuId: string;
    timestamp: string;
  } = req.body;

  const hardware: FullHardware | null = await prisma.hardware.findUnique({
    where: {
      id: hardwareId ?? ""
    },
    include: {
      location: {
        include: {
          orders: {
            include: {
              items: true,
              location: true
            }
          },
          settings: true,
          events: true,
          groups: true,
          viewers: true,
          owners: true,
        },
      }
    }
  });

  if (hardware == undefined) {
    res.status(400).send("Could not find hardware with ID " + hardwareId);
    return;
  }

  if (hardware.location == undefined || hardware.location.events == undefined || hardware.location.events.length == 0) {
    res.status(400).send("Could not find location or events for hardware with ID " + hardware.location.id);
    return;
  }

  // TODO(Suhana): Determine if there's a better way to get the company from hardware ID
  const companyId: string = hardware.location.events[0].companyId;

  const company: Company | null = await prisma.company.findUnique({
    where: {
      id: companyId ?? ""
    },
  });

  if (company == undefined) {
    // await logApi("borrow", false, "Company invalid/outdated");
    res.status(400).send("Company invalid/outdated.");
    return;
  }

  switch (company.subscriptionType) {
    case (SubscriptionType.FREE):
      // res.status(202).send("Validated borrow event. Processing...");
      break;
    case (SubscriptionType.PREMIUM):
      // res.status(202).send("Validated borrow event. Processing...");
      // TODO
      break;
    case (SubscriptionType.PREMIUM_PLUS):
      // TODO
      // res.status(202).send("Validated borrow event. Processing...");
      break;
    default:
      break;
  }

  /* Create event. */
  await fetch(`${process.env.NEXTAUTH_URL}/api/tracking/create-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: companyId,
      consumerId: consumerId,
      itemId: itemId,
      action: Action.BORROW,
      skuId: skuId,
      locationId: hardware.locationId,
      timestamp: timestamp,
    }),
  });

  res.status(200).send("Successfully created event for location " + hardware.locationId + ".");

  return;
}

export default borrow;
