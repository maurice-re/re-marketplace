import { LocationType, Role } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";


async function createPeerUser(req: Request, res: Response) {
  const {
    companyId, firstName, lastName, email, role, newCompanyName, newCompanyCustomerId
  }: {
    companyId: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Role,
    newCompanyName: string,
    newCompanyCustomerId: string;
  } = req.body;

  const now = new Date();

  var userCompanyId = companyId;

  // Only create new company if the appropriate details are passed and companyId is empty
  if (newCompanyName !== '' && (companyId === '' || !companyId)) {
    const company = await prisma.company.create({
      data: {
        createdAt: now,
        name: newCompanyName,
        customerId: newCompanyCustomerId
      },
    });
    userCompanyId = company.id;
  }

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
      companyId: userCompanyId,
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
