"use client";
import { User, Company } from "@prisma/client";
import { useEffect, useState } from "react";
import AddLocationForm from "../../../components/locations/addLocationForm";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";

function Locations({
    user,
    company
}: {
    user: User;
    company: Company;
}) {
    return (
        <div className="flex items-center justify-center w-full">
            <AddLocationForm user={user} company={company} />
        </div>
    );
}

export default Locations;
