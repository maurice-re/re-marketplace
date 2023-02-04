import { Location } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
  const { userId }: { userId: string; } =
    req.body;

  if (!userId) {
    res.status(400).send("Invalid user ID");
  }

  if (req.method == "POST") {
    const newLocation = await prisma.location.create({
      data: {
        city: city,
        country: country,
        line1: line1,
        line2: line2,
        shippingName: shippingName,
        state: state,
        zip: zip,
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
}

export default handler;
