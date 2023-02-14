import { Location, User } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const {
        name,
        locations,
    }: {
        name: string;
        locations: Location[];
    } =
        req.body;
    const { userId } = req.query;

    /* Validate user.  */

    const user = await prisma.user.findUnique({
        where: {
            id: userId ?? "",
        },
    });

    if (!user) {
        res.status(400).send({ message: "Invalid user indicated." });
        return;
    }

    /* Handle GET behaviour. */

    if (req.method == "GET") {
        // Return all groups with at least one location that the specified user is an owner or viewer of.
        const groupsWithOwnedLocations = await prisma.group.findMany({
            where: {
                // Find groups where..
                locations: {
                    some: {
                        // ..at least one (some) locations..
                        owners: {
                            some: {
                                // .. have at least one owner ..
                                id: {
                                    in: [userId], // .. with an ID that matches one of the following.
                                },
                            },
                        },
                    },
                },
            },
        });
        const groupsWithViewableLocations = await prisma.group.findMany({
            where: {
                // Find groups where..
                locations: {
                    some: {
                        // ..at least one (some) locations..
                        viewers: {
                            some: {
                                // .. have at least one owner ..
                                id: {
                                    in: [userId], // .. with an ID that matches one of the following.
                                },
                            },
                        },
                    },
                },
            },
        });

        res.status(200).send({ groups: [...groupsWithOwnedLocations, ...groupsWithViewableLocations] });
        return;
    }

    /* Handle POST behaviour. */

    if (!name || typeof name != "string") {
        res.status(400).send({ message: "No name provided." });
        return;
    }

    if (!locations || locations.length == 0) {
        res.status(400).send({ message: "At least one location must be provided." });
        return;
    }

    if (req.method == "POST") {
        const newGroup = await prisma.group.create({
            data: {
                userId: userId,
                name: name,
                locations: {
                    connect: locationIds,
                },
                createdAt: now,
            },
        });
        res.status(200).send({ message: "Created new group with ID " + newGroup.id + "." });
    }

    const now = new Date();

    const locationIds: any[] = [];
    locations.forEach(async (location) => {
        locationIds.push({ id: location.id });
    });

    if (req.method == "POST") {
        const newGroup = await prisma.group.create({
            data: {
                userId: userId,
                name: name,
                locations: {
                    connect: locationIds,
                },
                createdAt: now,
            },
        });
        res.status(200).send({ message: "Created new group with ID " + newGroup.id + "." });
        return;
    }
}

export default handler;
