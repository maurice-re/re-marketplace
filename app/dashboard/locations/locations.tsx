"use client";
import { User, Group } from "@prisma/client";
import AddGroupForm from "../../../components/locations/addGroupForm";
import AddLocationForm from "../../../components/locations/addLocationForm";
import GroupsList from "../../../components/locations/groupsList";
import LocationsList from "../../../components/locations/locationsList";
import { FullLocation } from "../../server-store";

function Locations({
    user,
    ownedLocations,
    viewableLocations,
    createdGroups,
    memberGroups
}: {
    user: User;
    ownedLocations: FullLocation[];
    viewableLocations: FullLocation[];
    createdGroups: Group[];
    memberGroups: Group[];
}) {
    const deleteLocation = async (location: FullLocation) => {
        const res = await fetch(`/api/locations/location?locationId=${location.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        const { message } = await res.json();
        if (res.status != 200) {
            console.log("Delete location error: ", message);
        } else {
            console.log("Delete location success: ", message);
        }
    };
    return (
        <div className="bg-re-black flex">
            <div className="flex items-start justify-center w-full flex-col">
                <div className="flex w-full justify-center items-center gap-6">
                    <LocationsList locations={ownedLocations} title="Owned Locations" caption="The locations you can make orders for." handleDelete={deleteLocation} deleteDescription="delete a location" />
                    <LocationsList locations={viewableLocations} title="Viewable Locations" caption="The locations you can view orders of." handleDelete={null} deleteDescription="delete a location" />
                </div>
                <div className="mx-auto mt-8 bg-re-dark-green-300 border rounded-md border-re-gray-300 flex flex-col font-theinhardt text-white w-1/2">
                    <div className="p-4 text-lg">Add Location</div>
                    <div className="bg-re-gray-300 h-px" />
                    <AddLocationForm user={user} />
                </div>
                <div className="mx-auto mt-8 bg-re-dark-green-300 border rounded-md border-re-gray-300 flex flex-col font-theinhardt text-white w-1/2">
                    <div className="p-4 text-lg">Add Group</div>
                    <div className="bg-re-gray-300 h-px" />
                    <AddGroupForm user={user} ownedLocations={ownedLocations} />
                </div>
                <div className="flex w-full mt-3 justify-center items-center gap-6">
                    <GroupsList user={user} createdGroups={createdGroups} memberGroups={memberGroups} />
                </div>
            </div>
        </div>
    );
}

export default Locations;
