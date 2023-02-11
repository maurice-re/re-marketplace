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

    if (!name || typeof name != "string") {
        res.status(400).send({ message: "No name provided." });
    }

    if (!locations || locations.length == 0) {
        res.status(400).send({ message: "At least one location must be provided." });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId ?? "",
        },
    });

    if (!user) {
        res.status(400).send({ message: "Invalid user indicated." });
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
    }
}

export default handler;
