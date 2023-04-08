import { Action, Company, Hardware, SubscriptionType } from "@prisma/client";
import type { Request, Response } from "express";
import { FullHardware } from "../../../app/server-store";
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
        await logApi("bin", false, `Missing or Invalid API key: ${authorization}.`);
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

    /* Update the date the hardware was last replaced to now. */
    await prisma.hardware.update({
        where: {
            id: hardware.id,
        },
        data: {
            lastReplaced: new Date(),
        },
    });

    res.status(200).send("Successfully registered latest replacement date.");

    return;
}

export default bin;
