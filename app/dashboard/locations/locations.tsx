"use client";
import { User, Company, Location, Group } from "@prisma/client";
import AddGroupForm from "../../../components/locations/addGroupForm";
import AddLocationForm from "../../../components/locations/addLocationForm";
import GroupsList from "../../../components/locations/groupsList";
import LocationsList from "../../../components/locations/locationsList";

function Locations({
    user,
    company,
    ownedLocations,
    viewableLocations,
    createdGroups,
    memberGroups
}: {
    user: User;
    company: Company;
    ownedLocations: Location[];
    viewableLocations: Location[];
    createdGroups: Group[];
    memberGroups: Group[];
}) {
    const handleDeleteLocation = async (locationId: string) => {
        const res = await fetch(`/api/locations/location?locationId=${locationId}`, {
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
                    <LocationsList locations={ownedLocations} title="Owned Locations" caption="The locations you can make orders for." owned={true} handleDelete={handleDeleteLocation} />
                    <LocationsList locations={viewableLocations} title="Viewable Locations" caption="The locations you can view orders of." owned={false} handleDelete={null} />
                </div>
                <div className="w-full flex gap-8">
                    <div className="flex-col w-1/2 flex items-start justify-start">
                        <h1 className="w-full text-xl text-left pb-2 pt-8">Add Location</h1>
                        <AddLocationForm user={user} company={company} />
                    </div>
                    <div className="flex-col w-1/2 flex items-start justify-start">
                        <h1 className="w-full text-xl text-left pb-2 pt-8">Add Group</h1>
                        <AddGroupForm user={user} company={company} ownedLocations={ownedLocations} viewableLocations={viewableLocations} />
                    </div>
                </div>
                <div className="flex w-full justify-center items-center gap-6">
                    <GroupsList user={user} createdGroups={createdGroups} memberGroups={memberGroups} />
                </div>
            </div>
        </div>
    );
}

export default Locations;
