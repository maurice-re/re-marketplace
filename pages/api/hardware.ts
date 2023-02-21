import type { Request, Response } from "express";
import { ApiError } from "next/dist/server/api-utils";
import { prisma } from "../../constants/prisma";

async function handler(req: Request, res: Response) {
  if (req.method == "POST") {
    const {
      deviceId,
      locationId,
      action,
      notes,
    }: {
      deviceId: string;
      locationId: string;
      action: string;
      notes: string;
    } = req.body;

    try {
      const newHardware = await prisma.hardware.create({
        data: {
          id: deviceId,
          locationId: locationId,
          return: action == "return",
          notes: notes,
        },
      });
      res.status(200).send({ id: newHardware.id });
    } catch (e) {
      const error = e as ApiError;
      res
        .status(500)
        .send({ error: "Error creating hardware " + error.message });
      return;
    }
  }
}
export default handler;
