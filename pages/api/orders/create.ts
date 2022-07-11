import type { Request, Response } from "express";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../constants/firebase";
import { Order } from "../../../models/order";

async function create(req: Request, res: Response) {
  try {
    const { json } = req.body;
    const order: Order = JSON.parse(json);

    const ref = await addDoc(collection(db, "orders"), order);
  } catch (e) {
    console.log(e);
  }
}

export default create;
