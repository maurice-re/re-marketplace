"use client";
import { User, Company, Location } from "@prisma/client";
import { useEffect, useState } from "react";
import AddLocationForm from "../../../components/locations/addLocationForm";
import LocationsList from "../../../components/locations/locationsList";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";

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
        <div className="flex items-center justify-center w-full flex-col">
            <div className="flex w-full justify-center items-center">
                <LocationsList user={user} locations={ownedLocations} owned={true} />
                <LocationsList user={user} locations={viewableLocations} owned={false} />
            </div>
            <AddLocationForm user={user} company={company} />
        </div>
    );
}

export default Locations;
