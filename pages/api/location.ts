import { Location } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../constants/prisma";

async function handler(req: Request, res: Response) {
  const { location, locationId }: { location: Location; locationId: string; } =
    req.body;
  const { userId, id, withItems, hardware } = req.query;

  if (!userId) {
    res.status(400).send("Invalid user ID");
  }

  if (req.method == "DELETE") {
    await prisma.location.delete({ where: { id: locationId } });
    res.status(200).send();
  }


  const userWithItems = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      ownedLocations: {
        include: {
          orders: {
            include: {
              items: !!withItems
            }
          }
        }
      },
    }
  });


  if (req.method == "POST") {
    const newLocation = await prisma.location.create({
      data: {
        city: location.city,
        country: location.country,
        line1: location.line1,
        line2: location.line2,
        shippingName: location.shippingName,
        state: location.state,
        zip: location.zip,
      },
    });
    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        ownedLocations: {
          set: [newLocation]
        },
      },
    });
    res.status(200).send({ id: newLocation.id });
  }

  if (req.method == "GET" && typeof userId == "string") {
      const locations = userWithItems?.ownedLocations ?? [];
      res.status(200).send({ locations: locations });
  }
  if (req.method == "GET" && typeof id == "string") {
    const location = await prisma.location.findUnique({
      where: {
        id: id,
      },
      include: {
        hardware: !!hardware,
      }
    });
    res.status(200).send({ location: location });
  }
}

export default handler;
