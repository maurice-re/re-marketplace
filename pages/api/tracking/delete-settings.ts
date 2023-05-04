import { Request, Response } from "express";
import { prisma } from "../../../constants/prisma";

async function deleteSettings(req: Request, res: Response) {
    if (req.method != "POST") {
        res.status(400).send();
        return;
    }

    await prisma.settings.deleteMany();

    res.status(200).send();

}
export default deleteSettings;