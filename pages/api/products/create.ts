import { Request, Response } from "express";
import { addDoc, collection } from "firebase/firestore";
import { db, reviver } from "../../../constants/firebase";

type Product = {
    images: string[];
    locations: string[];
    material: string;
    name: string;
    numOrders: number;
    numSold: number;
    price: {
      quantity: number,
      price: number
    }[]
    size: string;
}

async function create(req: Request, res: Response) {
    try {
      const { json } = req.body;
      const product: Product = JSON.parse(json, reviver);
      console.log(product)

      const ref = await addDoc(collection(db, "products"), product);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
}

export default create;
