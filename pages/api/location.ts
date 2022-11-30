import { Location } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../constants/prisma";

async function handler(req: Request, res: Response) {
  const { location, locationId }: { location: Location; locationId: string } =
    req.body;
  const { companyId, withItems } = req.query;

  if (req.method == "POST") {
    const newLocation = await prisma.location.create({
      data: {
        city: location.city,
        country: location.country,
        companyId: location.companyId,
        line1: location.line1,
        line2: location.line2,
        shippingName: location.shippingName,
        state: location.state,
        zip: location.zip,
      },
    });
    res.status(200).send({ id: newLocation.id });
  }

  if (req.method == "DELETE") {
    await prisma.location.delete({ where: { id: locationId } });
    res.status(200).send();
  }

  if (req.method == "GET" && typeof companyId == "string") {
    if (withItems == "true") {
      const locations = await prisma.location.findMany({
        where: {
          companyId: companyId,
        },
        include: {
          orderItems: {
            take: 1,
          }
        }
      });
      res.status(200).send({ locations: locations });
    } else {
      const locations = await prisma.location.findMany({
        where: {
          companyId: companyId,
        },
      });
      res.status(200).send({ locations: locations });
    }
  }
}

export default handler;
