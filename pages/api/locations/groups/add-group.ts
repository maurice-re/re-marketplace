import { Penalty, TrackingType, LocationType } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const { userId,
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
    }: {
        userId: string;
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
    } =
        req.body;

    if (!userId || typeof userId != "string") {
        res.status(400).send({ message: "No user ID provided." });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            ownedLocations: true,
            viewableLocations: true,
        },
    });

    if (!user) {
        res.status(400).send({ message: "Invalid user." });
    }

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
                            id: user?.id,
                        }],
                },
                viewers: {
                    connect: [
                        {
                            id: user?.id,
                        }
                    ],
                },
            },
        });
        res.status(200).send({ message: "Created new location with ID " + newLocation.id + "." });
    }
}

export default handler;
