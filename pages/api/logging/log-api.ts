import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


export default async function handler(req: Request, res: Response) {
  const { route, message, success } = req.body;
  await prisma.apiLogging.create({data: {route: route, message: message, success: success}})
  .then(() => res.status(200).json(`Call to ${route} logged`))
  .catch(() => res.send(500).json(`Error logging route: ${route}`));
}
