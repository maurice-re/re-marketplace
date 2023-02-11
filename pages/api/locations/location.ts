import { Penalty, TrackingType, LocationType, Location, User } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
  const {
    city,
    country,
    displayName,
    line1,
    line2,
    penalty,
    shippingName,
    state,
    trackingType,
    type,
    zip,
    locationIds,
    userIds,
    owned,
  }: {
    city: string;
    country: string;
    displayName: string;
    line1: string;
    line2: string;
    penalty: Penalty;
    shippingName: string;
    state: string;
    trackingType: TrackingType;
    type: LocationType;
    zip: string;
    locationIds: string[];
    userIds: string[];
    owned: boolean;
  } =
    req.body;
  const { userId, locationId, withItems, hardware } = req.query;

  /* Validate user. */

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

  if (!userWithItems) {
    res.status(400).send({ message: "Invalid user." });
  }

  /* Handle location DELETE behaviour. */

  if (req.method == "DELETE") {
    if ((locationId && typeof locationId == "string") && userIds) {
      // Disconnect provided users from specified location
      userIds.forEach(async userId => {
        if (owned) {
          // Disconnect owners
          await prisma.location.update({
            where: {
              id: locationId,
            },
            data: {
              owners: {
                disconnect: [
                  {
                    id: userId,
                  }
                ],
              },
            },
          });
        } else {
          // Disconnect viewers
          await prisma.location.update({
            where: {
              id: locationId as string,
            },
            data: {
              viewers: {
                disconnect: [
                  {
                    id: userId,
                  }
                ],
              },
            },
          });
        }
      });
    } else if ((userId && typeof userId == "string") && locationIds) {
      // Disconnect provided locations from specified user
      locationIds.forEach(async locationId => {
        if (owned) {
          // Disconnect owners
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              ownedLocations: {
                disconnect: [
                  {
                    id: locationId,
                  }
                ],
              },
            },
          });
        } else {
          // Disconnect viewers
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              viewableLocations: {
                disconnect: [
                  {
                    id: locationId,
                  }
                ],
              },
            },
          });
        }
      });
    }

    res.status(200).send({ message: "Disconnected location(s) from user ID " + userId + "." });
  }

  /* Handle location GET behaviour. */

  if (req.method == "GET" && typeof userId == "string") {
    const locations = userWithItems?.ownedLocations ?? [];
    res.status(200).send({ locations: locations });
  }

  if (req.method == "GET" && typeof locationId == "string") {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        hardware: !!hardware,
      }
    });
    res.status(200).send({ location: location });
  }

  /* Handle location POST behaviour. */

  if (req.method == "POST") {
    const newLocation = await prisma.location.create({
      data: {
        city: city,
        country: country,
        displayName: displayName,
        line1: line1,
        line2: line2,
        penalty: penalty,
        shippingName: shippingName,
        state: state,
        trackingType: trackingType,
        type: type,
        zip: zip,
        owners: {
          connect: [
            {
              id: userId,
            }],
        },
        viewers: {
          connect: [
            {
              id: userId,
            }
          ],
        },
      },
    });
    res.status(200).send({ message: "Created new location with ID " + newLocation.id + "." });
  }
}

export default handler;
