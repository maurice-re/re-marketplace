import { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { getSkusFromProduct } from "../../../utils/prisma/seedUtils";


async function sku(req: Request, res: Response) {
    if (req.body == undefined || req.method != "Post") {
        res.status(400).send()
        return;
    }
    
    const skus = getSkusFromProduct(req.body);
    await prisma.sku.deleteMany({});
    console.log("deleted");
    await prisma.sku.createMany({
        data: skus
    })

    res.status(200).send()
    
}
export default sku