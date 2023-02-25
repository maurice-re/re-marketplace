"use client";
import { User, Company, Location, Group } from "@prisma/client";
import LocationsList from "../../components/locations/locationsList";

function Group({
    groupId,
    groupLocations,
    createdGroups,
}: {
    groupId: string;
    groupLocations: Location[];
    createdGroups: Group[];
}) {
    const createdGroup: boolean = createdGroups.some(g => g.id === groupId);

    // Ensure that when members are added, they are added as viewers to the locations in the group

    const disconnectLocationFromGroup = async (location: Location) => {
        const res = await fetch(`/api/groups/group?groupId=${groupId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                locations: [location]
            }),
        });
        const { message } = await res.json();
        if (res.status != 200) {
            console.log("Disconnect location from group error: ", message);
        } else {
            console.log("Disconnect location from group success: ", message);
        }
    };
    return (
        <div className="flex-col w-full bg-re-black flex">
            <h1 className="text-2xl font-theinhardt text-white text-center py-10">
                Group Details
            </h1>
            <div className="flex w-full flex-col items-center justify-center space-y-4">
                <LocationsList locations={groupLocations} title="Group Locations" caption="The locations that are part of this group, each of which you are either an owner or viewer of." handleDelete={createdGroup ? disconnectLocationFromGroup : null} deleteDescription="disconnect a location from the group" />
            </div>
        </div>
    );
}

export default Group;
