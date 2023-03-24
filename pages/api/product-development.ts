import type { Request, Response } from "express";
import { prisma } from "../../constants/prisma";


export default async function handler(req: Request, res: Response) {
    if (req.method === "POST") {
        const { id, companyName, companyId, customerId, firstName, lastName, email } = req.body;

        const now = new Date();
        let _companyId = typeof companyId == "string" ? companyId : "";

        if (_companyId == "") {
            const company = await prisma.company.create({
                data: {
                    createdAt: now,
                    customerId: customerId,
                    name: companyName,
                }
            });
            _companyId = company.id;
            await prisma.user.create({
                data: {
                    companyId: company.id,
                    createdAt: now,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                }
            });
        }
        await prisma.productDevelopment.update({
            where: {
                id: id,
            },
            data: {
                companyId: _companyId,
                status: "PROCESSING",
                initiationPaid: true,
                initiationPaidAt: now,
            }
        });
        res.status(200).send();
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
