import { Hardware } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function bin(req: Request, res: Response) {
    // Check Request Method
    if (req.method != "POST") {
        await logApi(`${req.method} event`, false, "HTTP Operation not supported.");
        res.status(401).send("Bad Request: POST expected.");
    }
    // Check API Key Format
    const { authorization } = req.headers;
    if (!authorization || !authorization?.startsWith("Bearer")) {
        await logApi("capacity", false, `Missing or Invalid API key: ${authorization}.`);
        res.status(401).send("Bad Request: Invalid API key format.");
        return;
    }

    /* Get request info. */
    const {
        hardwareId, // Device ID
    }: {
        hardwareId: string;
    } = req.body;

    const hardware: Hardware | null = await prisma.hardware.findUnique({
        where: {
            id: hardwareId ?? ""
        },
    });

    if (!hardware) {
        res.status(400).send({ error: "Bad Request: Could not find hardware with ID " + hardwareId });
        return;
    }

    /* Return "True" if at capacity and "False" otherwise. */
    res.status(200).send({ message: hardware.capacity === hardware.containerCount ? "True" : "False" });

    return;
}

export default bin;
