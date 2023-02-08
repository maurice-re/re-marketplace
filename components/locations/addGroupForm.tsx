import { ChangeEvent, FormEvent, useState } from "react";
import { User, Company, Location, LocationType, Penalty, TrackingType } from "@prisma/client";
import InputField from "../form/input-field";
import MultiselectField from "../form/multiselect-field";

type AddGroupFormInputs = {
    name: string;
    locations: Location[];
};

export default function AddGroupForm({ user, company, ownedLocations, viewableLocations }: { user: User; company: Company; ownedLocations: Location[]; viewableLocations: Location[]; }) {
    const [inputValues, setInputValues] = useState<AddGroupFormInputs>({
        name: "",
        locations: {} as Location[],
    });
    const [errorInputValues, setErrorInputValues] = useState<AddGroupFormInputs>();
    const [successInputValues, setSuccessInputValues] = useState<AddGroupFormInputs>();

    const {
        name,
        locations,
    } = inputValues;

    const canSubmit = () => {
        // Check that required fields were entered
        if (name != "" &&
            locations.length > 0 &&
            inputValues != errorInputValues &&
            inputValues !== successInputValues
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (
            user &&
            location
        ) {
            const res = await fetch("/api/locations/groups/add-group", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    locations: locations
                }),
            });
            if (res.status != 200) {
                setErrorInputValues(inputValues);
            } else {
                setSuccessInputValues(inputValues);
            }
            const { message } = await res.json();
            setMessage(message);
            setIsLoading(false);
        }
    };

    return (
        <form id="add-location-form" className="justify-center items-center flex w-full flex-col" onSubmit={handleSubmit}>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Name</div>
                <InputField top bottom placeholder={"Name"} value={name} name={"name"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Tracking Type</div>
                {/* TODO(Suhana): Show the location IDs, but send the locations themselves. */}
                <MultiselectField top bottom options={[...ownedLocations.map(location => location.id), ...viewableLocations.map(location => location.id)]} placeholder={"Locations"} value={locations} name={"locations"} onChange={handleChange} />
            </div>
            <button
                id="submit"
                disabled={!canSubmit()}
                className={`${(!canSubmit() || isLoading)
                    ? "text-re-gray-300  border-re-gray-300"
                    : "border-re-green-300"
                    } border-2 rounded-md py-1 font-theinhardt-300 text-white text-lg w-1/4 mt-4`}
            >
                Create
            </button>
            {message && (errorInputValues === inputValues || successInputValues === inputValues) && (
                <div
                    id="error-message"
                    className={`font-theinhardt text-left mt-4 ${errorInputValues === inputValues ? "text-error" : "text-re-green-500"
                        }`}
                >
                    {message}
                </div>
            )}
        </form>
    );
}
