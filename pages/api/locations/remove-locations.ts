import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const { userId, locationIds, owned,
    }: {
        userId: string;
        locationIds: string[];
        owned: boolean;
    } =
        req.body;

    if (!userId || typeof userId != "string") {
        res.status(400).send({ message: "No location ID provided." });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            viewableLocations: true,
            ownedLocations: true,
        },
    });

    if (!user) {
        res.status(400).send({ message: "Invalid user." });
    }

    if (req.method == "POST") {
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

        res.status(200).send({ message: "Disconnected location(s) from user ID " + userId + "." });
    }
}

export default handler;
