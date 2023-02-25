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
    owner,
    ownerEmails,
    viewerEmails
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
    owner: boolean;
    ownerEmails: string[],
    viewerEmails: string[],
  } =
    req.body;
  const { userId, locationId, withItems, hardware } = req.query;

  /* Handle location DELETE behaviour. */

  if (req.method == "DELETE") {
    if ((locationId && typeof locationId == "string") && userIds) {
      // Disconnect provided users from specified location
      const ownerOrViewerIds: any[] = [];
      userIds.forEach(async (userId: string) => {
        ownerOrViewerIds.push({ id: userId });
      });

      if (owner) {
        // Disconnect owners
        if (ownerOrViewerIds.length === 1) {
          res.status(400).send({ message: "Failed to disconnect owner from location with ID " + locationId + ", because every location must have at least one owner." });
          return;
        }
        await prisma.location.update({
          where: {
            id: locationId,
          },
          data: {
            owners: {
              disconnect: ownerOrViewerIds,
            },
          },
        });
        res.status(200).send({ message: "Disconnected owner(s) from location with ID " + locationId + "." });
        return;
      } else {
        // Disconnect viewers
        await prisma.location.update({
          where: {
            id: locationId,
          },
          data: {
            viewers: {
              disconnect: ownerOrViewerIds,
            },
          },
        });
        res.status(200).send({ message: "Disconnected viewer(s) from location with ID " + locationId + "." });
        return;
      }
    } else if ((userId && typeof userId == "string") && locationIds) {
      // Disconnect provided locations from specified user
      const ownedOrViewableLocationIds: any[] = [];
      locationIds.forEach(async (locationId: string) => {
        ownedOrViewableLocationIds.push({ id: locationId });
      });

      if (owned) {
        // Disconnect owned locations
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ownedLocations: {
              disconnect: ownedOrViewableLocations,
            },
          },
        });
        res.status(200).send({ message: "Disconnected location(s) from owner with ID " + userId + "." });
        return;
      } else {
        // Disconnect viewable locations
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            viewableLocations: {
              disconnect: ownedOrViewableLocations,
            },
          },
        });
        res.status(200).send({ message: "Disconnected location(s) from viewer with ID " + userId + "." });
        return;
      }
    } else if (locationId && typeof locationId == "string") {
      const location = await prisma.location.findUnique({
        where: {
          id: locationId ?? "",
        },
        include: {
          owners: true,
          viewers: true,
          groups: true
        }
      });
      let ownerIds: any[] = [];
      let viewerIds: any[] = [];
      let groupIds: any[] = [];

      (location.owners).forEach(owner => {
        ownerIds.push({ id: owner.id });
      });
      (location.viewers).forEach(viewer => {
        viewerIds.push({ id: viewer.id });
      });
      (location.groups).forEach(group => {
        groupIds.push({ id: group.id });
      });

      // Disconnect all owners and viewers from location
      // Disconnect groups from location
      await prisma.location.update({
        where: {
          id: locationId ?? "",
        },
        data: {
          owners: {
            disconnect: ownerIds,
          },
          viewers: {
            disconnect: viewerIds,
          },
          groups: {
            disconnect: groupIds,
          },
        },
      });

      // Delete location
      await prisma.location.delete({
        where: {
          id: locationId ?? ""
        },
      });
    }
    return;
  }

  /* Validate user. */

  const userWithItems = await prisma.user.findUnique({
    where: {
      id: userId ?? "",
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
    return;
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
    return;
  }

  /* Handle location POST behaviour. */

  if (req.method == "POST") {
    // Get all user emails
    const users = await prisma.user.findMany();
    const allUserEmails = users.map(user => user.email);

    let ownerIds: any[] = [];
    let viewerIds: any[] = [];
    let foundUser: User | null;
    let foundUsers: User[] | null;
    let found = false;

    // Convert owner emails to owner objects
    new Promise<void>((resolve, reject) => {
      if (ownerEmails.length === 0) resolve();
      ownerEmails.forEach(async (ownerEmail: string, index: number) => {
        // Check if user email is valid
        if (allUserEmails.includes(ownerEmail)) {
          // Find first user with matching email
          foundUsers = await prisma.user.findMany({ where: { email: ownerEmail } });
          foundUser = foundUsers[0];
          ownerIds.push({ id: foundUser.id });
        } else {
          res.status(400).send({ message: "Invalid owner email " + ownerEmail + "." });
          return;
        }
        if (ownerEmail == userWithItems.email) {
          found = true;
        }
        if (index === ownerEmails.length - 1) resolve();
      });
    }).then(async () => {
      if (ownerIds.length == 0) {
        res.status(400).send({ message: "At least one valid owner email must be provided." });
        return;
      }
      console.log("Created ownerIds");
      console.log(ownerIds);

      // The creator of the location should be an owner
      if (!found) {
        res.status(400).send({ message: "The creator of the location must be provided in the owners list." });
        return;
      }

      // Convert owner emails to viewer objects
      new Promise<void>((resolve, reject) => {
        if (viewerEmails.length === 0) resolve();
        viewerEmails.forEach(async (viewerEmail: string, index: number) => {
          // Check if user email is valid
          if (allUserEmails.includes(viewerEmail)) {
            // Find first user with matching email
            foundUsers = await prisma.user.findMany({ where: { email: viewerEmail } });
            foundUser = foundUsers[0];
            viewerIds.push({ id: foundUser.id });
          } else {
            res.status(400).send({ message: "Invalid viewer email " + viewerEmail + "." });
            return;
          }
          if (index === viewerEmails.length - 1) resolve();
        });
      }).then(async () => {
        if (locationId && typeof locationId == "string") {
          // Update
          await prisma.location.update({
            where: {
              id: locationId ?? ""
            },
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
                connect: ownerIds,
              },
              viewers: {
                connect: viewerIds,
              },
            },
          });
          res.status(200).send({ message: "Updated location with ID " + locationId + "." });
        }
        else {
          // Create
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
                connect: ownerIds,
              },
              viewers: {
                connect: viewerIds,
              },
            },
          });
          res.status(200).send({ message: "Created new location with ID " + newLocation.id + "." });
        }
        return;
      });
    });
  }
}

export default handler;
