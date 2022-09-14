import { Request, Response } from "express";
import prisma from "../../../constants/prisma";


async function createCompany(req: Request, res: Response) {
    const { name } : {name: string} = req.body;
    
    if (!name){
        res.status(401).send("Name missing")
    }

    const company = await prisma.company.create({
        data: {
            name: name,
            createdAt: new Date(),
            customerId: "",

        }
    })
    res.status(200).send({companyId: company.id})
    
}
export default createCompany