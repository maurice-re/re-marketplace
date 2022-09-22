import { Location } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../constants/prisma";


async function handler(req: Request, res: Response) {
  const {location, locationId} : { location: Location, locationId: string } = req.body;
  const now = new Date();
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
            zip: location.zip
        }
    })
    res.status(200).send({id: newLocation.id})
  }

  if (req.method == "DELETE") {
    await prisma.location.delete({where: {id: locationId}});
    res.status(200).send();
  }
}

export default handler;