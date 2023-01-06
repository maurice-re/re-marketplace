import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function getUser(req: Request, res: Response) {
  const { id } = req.query;
  if (req.method == "GET" && typeof id == "string") {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });
    res.status(200).send({ user: user });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default getUser;