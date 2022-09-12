import { Request, Response } from "express";
import { nanoid } from "../../../utils/api/apiUtils";


async function createQr(req: Request, res: Response) {
    const { count, skuId } : {count: number, skuId: string} = req.body;
    let ids = [];

    for (let i = 0; i < count; i++) {
        ids.push(`re_${skuId}_${nanoid()}`)
    }
    res.status(200).send({codes: JSON.stringify(ids)})
    
}
export default createQr