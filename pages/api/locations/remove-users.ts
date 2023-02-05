import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const { locationId, userIds, owned,
    }: {
        locationId: string;
        userIds: string[];
        owned: boolean;
    } =
        req.body;

    if (!locationId || typeof locationId != "string") {
        res.status(400).send({ message: "No location ID provided." });
    }

    const location = await prisma.location.findUnique({
        where: {
            id: locationId,
        },
        include: {
            viewers: true,
            owneds: true,
        },
    });

    if (!location) {
        res.status(400).send({ message: "Invalid location." });
    }

    if (req.method == "POST") {
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
                        id: locationId,
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

        res.status(200).send({ message: "Removed  new location with ID " + locationId + "." });
    }
}

export default handler;
