import { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function deleteEvent(req: Request, res: Response) {
    if (req.method != "POST") {
        res.status(400).send();
        return;
    }

    const result = await prisma.event.deleteMany({
        where: {
            AND: [
                {
                    companyId: {
                        contains: 'clcr7jr5r0002v4bybxoznk72',
                    },
                },
            ],
        },
    });


    res.status(200).send();

}
export default deleteEvent;