"use client";
import { User, Company, Location, Group } from "@prisma/client";
import UpdateGroupForm from "../../components/locations/group/updateGroupForm";
import LocationsList from "../../components/locations/locationsList";

function Group({
    group,
    groupLocations,
    createdGroups,
    user,
    memberEmails,
    ownedLocations
}: {
    group: Group;
    groupLocations: Location[];
    createdGroups: Group[];
    user: User;
    ownedLocations: Location[];
    memberEmails: string[];
}) {
    const createdGroup: boolean = createdGroups.some(g => g.id === group.id);

    const disconnectLocationFromGroup = async (location: Location) => {
        const res = await fetch(`/api/groups/group?groupId=${group.id}&userId=${user.id}`, {
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
            <h1 className="font-theinhardt text-white text-center pt-10">
                Group Details
            </h1>
            <h1 className="text-3xl text-center pb-6">{group.name}</h1>
            <div className="flex w-full flex-col items-center justify-center space-y-4">
                <LocationsList locations={groupLocations} title="Group Locations" caption="The locations that are part of this group, each of which you are either an owner or viewer of." handleDelete={createdGroup ? disconnectLocationFromGroup : null} deleteDescription="disconnect a location from the group" />
            </div>
            {/* Only let them update the location if they are an owner of the location. */}
            {createdGroup &&
                (<div className='mt-6 mx-auto flex flex-col w-1/2 items-center justify-center'>
                    <h1>Update Group</h1>
                    <UpdateGroupForm user={user} group={group} ownedLocations={ownedLocations} initialMemberEmails={memberEmails} />
                </div>)
            }
        </div>
    );
}

export default Group;
