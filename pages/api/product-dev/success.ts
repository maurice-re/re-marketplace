import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


export default async function handler(req: Request, res: Response) {
    if (req.method === "POST") {
        const { id, companyName, customerId, firstName, lastName, email } = req.body;
        const now = new Date();
        const company = await prisma.company.create({
            data: {
                createdAt: now,
                customerId: customerId,
                name: companyName,
            }
        })
        const user = await prisma.user.create({
            data: {
                companyId: company.id,
                createdAt: now,
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: "ADMIN",
            }
        });
        await prisma.productDevelopment.update({
            where: {
                id: id,
            },
            data: {
                companyId: company.id,
                status: "PROCESSING",
            }
        });
        res.status(200).send();
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
