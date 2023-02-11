import { ChangeEvent, FormEvent, useState } from "react";
import { User, Company, Location, LocationType, Penalty, TrackingType } from "@prisma/client";
import InputField from "../form/input-field";
import MultiselectField from "../form/multiselect-field";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

type AddGroupFormInputs = {
    name: string;
    locations: Location[];
};

export default function AddGroupForm({ user, company, ownedLocations, viewableLocations }: { user: User; company: Company; ownedLocations: Location[]; viewableLocations: Location[]; }) {
    const [inputValues, setInputValues] = useState<AddGroupFormInputs>({
        name: "",
        locations: [] as Location[],
    });
    const [errorInputValues, setErrorInputValues] = useState<AddGroupFormInputs>();
    const [successInputValues, setSuccessInputValues] = useState<AddGroupFormInputs>();

    const {
        name,
        locations,
    } = inputValues;
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

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

    // All locations available to add/remove
    const ownedAndViewableLocations = [...ownedLocations, ...viewableLocations];
    const ownedAndViewableLocationIds = [...ownedLocations.map(location => location.id), ...viewableLocations.map(location => location.id)];

    const handleMultiselectDropdownChange = (location: Location) => {
        // let newLocations = locations;
        // if ((newLocations.map(location => location.id)).includes(id)) {
        //     // It's in, so remove
        //     newLocations = newLocations.filter(location => location.id != id);
        // } else {
        //     // It's not in, so add
        //     newLocations.push(ownedAndViewableLocations.filter(location => location.id == id)[0]);
        // }
        // setInputValues((prev) => ({
        //     ...prev,
        //     ["locations"]: newLocations,
        // }));
        let newLocations = locations;
        if (newLocations.includes(location)) {
            // It's in, so remove
            newLocations = newLocations.filter(loc => loc != location);
        } else {
            // It's not in, so add
            newLocations.push(ownedAndViewableLocations.filter(loc => loc == location)[0]);
        }
        setInputValues((prev) => ({
            ...prev,
            ["locations"]: newLocations,
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
            const res = await fetch(`/api/groups/add-group?userId=${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    locations: locations,
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
                <div className="text-lg font-semibold">Locations</div>
                {/* TODO(Suhana): Show the location IDs, but send the locations themselves. */}
                {/* <MultiselectField top bottom options={ownedAndViewableLocationIds} placeholder={"Locations"} value={locations} name={"locations"} onChange={handleMultiselectDropdownChange} /> */}

                <div className="p-0 my-0 relative w-full">
                    <div className="flex cursor-pointer px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <h1 className="w-full">{locations.length} selected</h1>
                        {dropdownOpen ? (<div className="flex items-center justify-center">< BsChevronUp size={20} /></div>
                        ) : (<div className="flex items-center justify-center"><BsChevronDown size={20} /></div>)}                    </div>
                    <ul className={`${dropdownOpen ? "block" : "hidden"} hover:block absolute left-0 w-full bg-re-dark-green-200 rounded-lg`}>
                        {ownedAndViewableLocations.map((location, index) => {
                            const isSelected = locations.includes(location);
                            return (
                                <li key={index} className="flex items-center px-2 py-4 cursor-pointer hover:bg-re-gray-500 rounded" onClick={() => handleMultiselectDropdownChange(location)}>
                                    <input type="checkbox" checked={isSelected} className="mr-2" readOnly />
                                    <span>{location.displayName}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
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
