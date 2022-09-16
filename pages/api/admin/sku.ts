import { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { getSkusFromProduct } from "../../../utils/prisma/seedUtils";


async function sku(req: Request, res: Response) {
    if (req.method != "POST") {
        res.status(400).send()
        return;
    }
    
    await prisma.sku.deleteMany({});
    
    const skus = getSkusFromProduct(await prisma.product.findMany({}));
    await prisma.sku.createMany({
        data: skus
    })

    res.status(200).send()
    
}
export default sku