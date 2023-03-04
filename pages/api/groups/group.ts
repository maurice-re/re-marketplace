import { Location, User, Group } from "@prisma/client";
import type { Request, Response } from "express";
import { FullGroup } from "../../../app/server-store";
import prisma from "../../../constants/prisma";

async function disconnectGroupLocations(group: FullGroup, locations: Location[]) {
    // Disconnect all locations from the group
    const locationIds: any[] = [];
    (locations).forEach(async (location: Location) => {
        locationIds.push({ id: location.id });
    });

    // Disconnect locations and members
    await prisma.group.update({
        where: {
            id: group.id ?? ""
        },
        data: {
            locations: {
                disconnect: locationIds,
            },
        },
    });
}

async function getGroupById(groupId: string): Promise<FullGroup> {
    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            members: true,
            locations: true
        }
    });
    return group as FullGroup;
}

async function disconnectGroupMembers(group: FullGroup) {
    // Disconnect all members from the group
    const memberIds: any[] = [];
    (group.members).forEach(async (member: User) => {
        memberIds.push({ id: member.id });
    });

    // Disconnect locations and members
    await prisma.group.update({
        where: {
            id: group.id ?? ""
        },
        data: {
            members: {
                disconnect: memberIds,
            },
        },
    });
}

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

    if (!userId || typeof userId != "string") {
        res.status(400).send({ message: "Invalid user ID indicated " + userId + "." });
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
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

    if (req.method == "DELETE" && groupId && typeof groupId == "string") {
        const group = await getGroupById(groupId);

        if (!group) {
            res.status(400).send({ message: "Invalid group indicated." });
            return;
        }

        if (locations) {
            // Disconnect given locations from the group
            await disconnectGroupLocations(group, locations);

            res.status(200).send({ message: "Disconnected provided location(s) from group with ID " + groupId + "." });
            return;
        } else {
            // Disconnect locations and members, then delete group
            await disconnectGroupLocations(group, group.locations);
            await disconnectGroupMembers(group);

            await prisma.group.delete({
                where: {
                    id: groupId ?? ""
                },
            });

            res.status(200).send({ message: "Deleted group with ID " + groupId + "." });
            return;
        }
    }

    /* Handle GET behaviour. */

    if (req.method == "GET") {
        // Send groups that the user a member of
        res.status(200).send({ groups: user.memberGroups });
        return;
    }

    /* Handle POST behaviour. */

    if (req.method == "POST") {
        // Update or create new group
        if (!name || typeof name != "string") {
            res.status(400).send({ message: "No name provided." });
            return;
        }

        if (!locations || locations.length == 0) {
            res.status(400).send({ message: "At least one location must be provided." });
            return;
        }

        const locationIds: any[] = [];

        // The creator of the group should be an owner of all the locations specified
        locations.forEach(async (location: Location) => {
            // Construct location ID object array
            locationIds.push({ id: location.id });

            const locationWithOwners = await prisma.location.findUnique({
                where: {
                    id: location.id,
                },
                include: {
                    owners: true,
                }
            });

            if (!locationWithOwners) {
                res.status(400).send({ message: "Invalid location specified." });
                return;
            }

            // Validate location
            if (!((locationWithOwners.owners).some(o => o.id === userId))) {
                // Found a location of which the user trying to make the group is not an owner
                res.status(400).send({ message: "The group creator, user with ID " + userId + " does not own every location specified." });
                return;
            }
        });

        const now = new Date();

        // Get all user emails
        const users = await prisma.user.findMany();
        const userEmails = users.map(user => user.email);

        const memberIds: any[] = [];
        let foundMember: User | null;
        let foundMembers: User[] | null;
        let found = false;

        new Promise<void>((resolve, reject) => {
            // Convert member emails to member objects
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
                if (memberEmail === user.email) {
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
            if (found === false) {
                res.status(400).send({ message: "The creator of the group must be provided in the members list." });
                return;
            }

            // Make each specified member a viewer of each specified location, unless they are already an owner or viewer
            memberIds.forEach(async (memberId: any) => {
                locations.forEach(async (location: Location) => {
                    const locationWithOwnersAndViewers = await prisma.location.findUnique({
                        where: {
                            id: location.id,
                        },
                        include: {
                            owners: true,
                            viewers: true,
                        }
                    });

                    if (!locationWithOwnersAndViewers) {
                        res.status(200).send({ message: "Invalid location specified with ID " + location.id + "." });
                        return;
                    }

                    if (!((locationWithOwnersAndViewers.owners).some(o => o.id === memberId)) && !((locationWithOwnersAndViewers.viewers).some(v => v.id === memberId))) {
                        console.log("Making member a viewer of the location");
                        // Make member a viewer of the location
                        await prisma.location.update({
                            where: {
                                id: location.id
                            },
                            data: {
                                viewers: {
                                    connect: [memberId],
                                },
                            },
                        });
                    }
                });
            });

            if (groupId && typeof groupId == "string") {
                // Update existing group
                const group = await getGroupById(groupId);

                // Disconnect all group locations and members
                await disconnectGroupLocations(group, group.locations);
                await disconnectGroupMembers(group);

                await prisma.group.update({
                    where: {
                        id: groupId
                    },
                    data: {
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
                res.status(200).send({ message: "Updated group with ID " + groupId + "." });
                return;
            } else {
                // Create new group
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
            }


        });
    }
}

export default handler;
