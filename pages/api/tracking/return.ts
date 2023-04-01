import { Action, Company, SubscriptionType } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function return (req: Request, res: Response) {

  // Check Request Method
  if (req.method != "POST") {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported.");
    res.status(401).send("Bad Request");
  }
  // Check API Key Format
  const { authorization } = req.headers;
  if (!authorization || !authorization?.startsWith("Bearer")) {
    await logApi("return", false, `Missing or Invalid API key: ${authorization}.`);
    res.status(401).send(`Invalid API key format.`);
    return;
  }

  // Get request info
  const {
    hardwareId,
    consumerId,
    itemId,
    locationId,
    skuId,
    timestamp
  }: {
    hardwareId: string;
    consumerId: string;
    itemId: string;
    locationId: string;
    skuId: string;
    timestamp: string;
  } = req.body;

  const hardware = prisma.hardware.findUnique({
    where: {
      id: hardwareId
    },
    include: {
      location:
      {
        include:
        {
          events: true
        }
      }
    }
  });

  if (!hardware.location.events || hardware.location.events.length == 0) {
    res.status(400).send("No events found for device's location.");
    return;
  }

  // TODO(Suhana): Determine if there's a better way to get the company from hardware ID
  const companyId: string = hardware.location.events[0].companyId;

  const company: Company | null = prisma.company.findUnique({
    where: {
      id: companyId
    },
  });

  if (company == undefined) {
    await logApi("return", false, "Company invalid/outdated");
    res.status(400).send("Company invalid/outdated.");
    return;
  }

  switch (company.subscriptionType) {
    case (SubscriptionType.FREE):
      res.status(202).send("Validated return event. Processing...");
      break;
    case (SubscriptionType.PREMIUM):
      // TODO
      break;
    case (SubscriptionType.PREMIUM_PLUS):
      // TODO
      break;
    default:
      break;
  }

  const createEventRes = await fetch("/api/tracking/create-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: companyId,
      consumerId: consumerId,
      itemId: itemId,
      action: Action.RETURN,
      skuId: skuId,
      locationId: locationId,
      timestamp: timestamp,
    }),
  });

  await logApi("return", true, "Attempted to created event.");

  return;
};

export default return;
