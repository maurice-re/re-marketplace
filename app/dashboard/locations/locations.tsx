"use client";
import { User, Company, Location } from "@prisma/client";
import AddGroupForm from "../../../components/locations/addGroupForm";
import AddLocationForm from "../../../components/locations/addLocationForm";
import LocationsList from "../../../components/locations/locationsList";

function Locations({
    user,
    company,
    ownedLocations,
    viewableLocations,
}: {
    user: User;
    company: Company;
    ownedLocations: Location[];
    viewableLocations: Location[];
}) {
    return (
        <div className="h-screen bg-re-black flex">
            <main className="flex items-start justify-center w-full flex-col">
                <div className="flex w-full justify-center items-center gap-6 pt-8">
                    <LocationsList user={user} locations={ownedLocations} owned={true} />
                    <LocationsList user={user} locations={viewableLocations} owned={false} />
                </div>
                <div
                    className="w-full flex gap-8">
                    <div className="flex-col w-1/2 flex items-start justify-start">
                        <h1 className="w-full text-xl text-left pb-2 pt-8">Add Location</h1>
                        <AddLocationForm user={user} company={company} />
                    </div>
                    <div className="flex-col w-1/2 flex items-start justify-start">
                        <h1 className="w-full text-xl text-left pb-2 pt-8">Add Group</h1>
                        <AddGroupForm user={user} company={company} ownedLocations={ownedLocations} viewableLocations={viewableLocations} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Locations;
