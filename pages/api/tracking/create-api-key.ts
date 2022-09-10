import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


async function createApiKey(req: Request, res: Response) {
    const { companyId } = req.body;
    const key = "" //Generate key
    
    prisma.company.update({
        where: {
            id: companyId
        },
        data: {
            apiKey: key
        }
    })
    
    res.status(200).send({apiKey: key})
    
}
export default createApiKey