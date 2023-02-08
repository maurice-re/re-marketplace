import { Location } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const {
        name,
        locations,
    }: {
        name: string;
        locations: Location[];
    } =
        req.body;

    if (!name || typeof name != "string") {
        res.status(400).send({ message: "No name provided." });
    }

    if (!locations || locations.length == 0) {
        res.status(400).send({ message: "At least one location must be provided." });
    }

    if (req.method == "POST") {
        const newGroup = await prisma.group.create({
            data: {
                name: name,
                locations: locations,
            },
        });
        res.status(200).send({ message: "Created new group with ID " + newGroup.id + "." });
    }
}

export default handler;
