import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";
import { logApi } from "../../../utils/apiUtils";

async function editUser(req: Request, res: Response) {
  const { id, firstName, lastName }: { id: string, firstName: string, lastName: string; } = req.body;
  if (req.method == "POST" && typeof firstName == "string" && typeof lastName == "string") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        lastName: lastName
      },
    });

    res.status(200).send({ success: `Successfully updated user ${id}` });
  } else {
    await logApi(`${req.method} event`, false, "HTTP Operation not supported");
    res.status(401).send("Bad Request");
  }
}

export default editUser;