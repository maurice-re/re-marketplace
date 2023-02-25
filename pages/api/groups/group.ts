import { Location, User } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../../constants/prisma";

async function handler(req: Request, res: Response) {
    const {
        name,
        locations,
        memberEmails
    }: {
        name: string;
        locations: Location[];
        memberEmails: string[];
    } =
        req.body;
    const { userId, groupId } = req.query;

    /* Validate user.  */

    const user = await prisma.user.findUnique({
        where: {
            id: userId ?? "",
        },
        include: {
            memberGroups: true,
        }
    });

    if (!user) {
        res.status(400).send({ message: "Invalid user indicated." });
        return;
    }

    /* Handle DELETE behaviour. */

    if (req.method == "DELETE") {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId ?? "",
            },
            include: {
                members: true
            }
        });

        if (!group) {
            res.status(400).send({ message: "Invalid group indicated." });
            return;
        }

        // Disconnect all locations from the group
        const locationIds: any[] = [];
        const locations = await prisma.location.findMany();
        locations.forEach(async (location) => {
            locationIds.push({ id: location.id });
        });

        // Disconnect all members from the group
        const memberIds: any[] = [];
        (group.members).forEach(async (member: User) => {
            memberIds.push({ id: member.id });
        });

        // Disconnect locations and members
        await prisma.group.update({
            where: {
                id: groupId ?? ""
            },
            data: {
                locations: {
                    disconnect: locationIds,
                },
                members: {
                    disconnect: memberIds,
                },
            },
        });

        // Delete group
        await prisma.group.delete({
            where: {
                id: groupId ?? ""
            },
        });

        res.status(200).send({ message: "Deleted group with ID " + groupId + "." });
        return;
    }

    /* Handle GET behaviour. */

    if (req.method == "GET") {
        res.status(200).send({ groups: user.memberGroups });
        return;
    }

    /* Handle POST behaviour. */

    if (req.method == "POST") {
        if (!name || typeof name != "string") {
            res.status(400).send({ message: "No name provided." });
            return;
        }

        if (!locations || locations.length == 0) {
            res.status(400).send({ message: "At least one location must be provided." });
            return;
        }

        const now = new Date();

        const locationIds: any[] = [];
        locations.forEach(async (location) => {
            locationIds.push({ id: location.id });
        });

        // Get all user emails
        const users = await prisma.user.findMany();
        const userEmails = users.map(user => user.email);

        let memberIds: any[] = [];
        let foundMember: User | null;
        let foundMembers: User[] | null;
        let found = false;

        // Convert member emails to member objects
        new Promise<void>((resolve, reject) => {
            if (memberEmails.length === 0) resolve();
            memberEmails.forEach(async (memberEmail: string, index: number) => {
                // Check if user email is valid
                if (userEmails.includes(memberEmail)) {
                    // Find first user with matching email
                    foundMembers = await prisma.user.findMany({ where: { email: memberEmail } });
                    foundMember = foundMembers[0];
                    memberIds.push({ id: foundMember.id });
                } else {
                    res.status(400).send({ message: "Invalid member email " + memberEmail + "." });
                    return;
                }
                if (memberEmail == user.email) {
                    found = true;
                }
                if (index === memberEmails.length - 1) resolve();
            });
        }).then(async () => {
            if (memberIds.length == 0) {
                res.status(400).send({ message: "At least one valid member email must be provided." });
                return;
            }

            // The creator of the group should be a member
            if (!found) {
                res.status(400).send({ message: "The creator of the group must be provided in the members list." });
                return;
            }

            const newGroup = await prisma.group.create({
                data: {
                    userId: userId,
                    name: name,
                    locations: {
                        connect: locationIds,
                    },
                    members: {
                        connect: memberIds,
                    },
                    createdAt: now,
                },
            });
            res.status(200).send({ message: "Created new group with ID " + newGroup.id + "." });
            return;
        });
    }
}

export default handler;
