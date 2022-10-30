import { LocationType, Role } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


async function createPeerUser(req: Request, res: Response) {
  const {
    companyId, firstName, lastName, email, role
  }: {
    companyId: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Role;
  } = req.body;

  const now = new Date();

  // const company = await prisma.company.create({
  //   data: {
  //     createdAt: now,
  //     name: form[3],
  //     customerId: customerId
  //   },
  // });

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (existingUser) {
    res.status(500).send({ message: "A user with this email already exists!" });
  }

  const user = await prisma.user.create({
    data: {
      companyId: companyId,
      createdAt: now,
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role
    },
  });

  if (user) {
    res.status(200).send({ message: "New user created successfully!" });

  } else {
    res.status(500).send({ message: "Invalid user details, please try again" });
  }
}

export default createPeerUser;
