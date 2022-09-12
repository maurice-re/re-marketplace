import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { nanoid } from "../../../utils/api/apiUtils";


async function createApiKey(req: Request, res: Response) {
    const { companyId } : {companyId: string | undefined} = req.body;

    if (companyId) {
        await prisma.apiKey.delete({
            where: {
                companyId: companyId
            }
        })
    }
    
    const key = nanoid(64);
    await prisma.apiKey.create(
        {
            data: {
                id: key,
                companyId: companyId
            }
        }
    )
    
    res.status(200).send({apiKey: key})
}
export default createApiKey