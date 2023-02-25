"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { User, Group, LocationType, Penalty, TrackingType, Location } from "@prisma/client";
import { BsArrowRight, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { BiX } from "react-icons/bi";
import InputField from "../../form/input-field";

type UpdateGroupFormInputs = {
    name: string;
    locations: Location[];
    memberEmails: string[];
    memberEmail: string;
};

export default function UpdateGroupForm({ group, user, initialMemberEmails, ownedLocations }: { group: Group; user: User; initialMemberEmails: string[]; ownedLocations: Location[]; }) {
    const initialGroupValues: UpdateGroupFormInputs = {
        name: group.name ?? "",
        locations: group.locations ?? [] as Location[],
        memberEmail: "",
        memberEmails: initialMemberEmails, // The creator of the location must be an owner
    };
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState<UpdateGroupFormInputs>(initialGroupValues);
    const [errorInputValues, setErrorInputValues] = useState<UpdateGroupFormInputs>();
    const [successInputValues, setSuccessInputValues] = useState<UpdateGroupFormInputs>();
    const {
        name,
        locations,
        memberEmails,
        memberEmail
    } = inputValues;
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const checkCanSubmit = () => {
        // Check that required fields were entered
        console.log("In here");
        if (name != "" &&
            locations.length > 0 &&
            memberEmails.length > 0 &&
            inputValues !== errorInputValues &&
            inputValues !== successInputValues &&
            inputValues !== initialGroupValues
        ) {
            console.log("returning true");
            return true;
        } else {
            console.log(locations);
            console.log(memberEmails);
            console.log(inputValues === errorInputValues);
            console.log(inputValues === successInputValues);
            console.log(inputValues === initialGroupValues);
            return false;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        // console.log("Set ", name, " to ", value);
        setCanSubmit(checkCanSubmit());
    };

    const handleMultiselectDropdownChange = (location: Location) => {
        let newLocations = locations;
        if (newLocations.some(l => l.id === location.id)) {
            // It's in, so remove
            console.log("Removing");
            newLocations = newLocations.filter(loc => loc.id != location.id);
        } else {
            // It's not in, so add
            console.log("Adding");
            newLocations.push(ownedLocations.filter(loc => loc.id == location.id)[0]);
        }
        setInputValues((prev) => ({
            ...prev,
            ["locations"]: newLocations,
        }));
        setCanSubmit(checkCanSubmit());
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (
            location && user
        ) {
            const res = await fetch(`/api/groups/group?userId=${user.id}&groupId=${group.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    locations: locations,
                    memberEmails: memberEmails,
                }),
            });
            if (res.status != 200) {
                setErrorInputValues(inputValues);
            } else {
                setSuccessInputValues(inputValues);
            }
            const { message } = await res.json();
            setCanSubmit(checkCanSubmit());
            setMessage(message);
            setIsLoading(false);
        }
    };

    const addMember = () => {
        if (memberEmail !== "") {
            memberEmails.push(memberEmail);
            setInputValues((prev) => ({
                ...prev,
                ["memberEmail"]: "",
            }));
        }
        setCanSubmit(checkCanSubmit());
    };

    const removeMember = (emailToRemove: string) => {
        const index = memberEmails.indexOf(emailToRemove);
        memberEmails.splice(index, 1);
        setInputValues((prev) => ({
            ...prev,
            ["memberEmails"]: memberEmails,
        }));
        setCanSubmit(checkCanSubmit());
    };

    const getPlaceholder = (value: string | null, placeholder: string) => {
        if (value && value !== "") {
            return value;
        } else {
            return placeholder;
        }
    };

    return (
        <form id="add-location-form" className="justify-center items-center flex w-full flex-col" onSubmit={handleSubmit}>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Name</div>
                <InputField top bottom placeholder={getPlaceholder(group.name, "Name")} value={name} name={"name"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Locations</div>
                <div className="p-0 my-0 relative w-full">
                    <div className="flex cursor-pointer px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 rounded-b" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <h1 className="w-full">{locations.length} selected</h1>
                        {dropdownOpen ? (<div className="flex items-center justify-center">< BsChevronUp size={20} /></div>
                        ) : (<div className="flex items-center justify-center"><BsChevronDown size={20} /></div>)}
                    </div>
                    <ul className={`${dropdownOpen ? "block" : "hidden"} hover:block absolute left-0 w-full bg-re-dark-green-200 rounded-lg`}>
                        {ownedLocations.map((location, index) => {
                            const isSelected = locations.some(l => l.id === location.id);
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
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Members</div>
                <div className='w-full flex'>
                    <div className="w-full">
                        <InputField top bottom placeholder={"Member Email"} value={memberEmail} name={"memberEmail"} onChange={handleChange} />
                    </div>
                    <div className="justify-center items-center">
                        <BsArrowRight className={`self-center my-4 justify-center items-center ml-4 ${memberEmail !== "" && "cursor-pointer"}`} size={25} onClick={() => addMember()} />
                    </div>
                </div>
                {memberEmails.map((email, index) => {
                    return (
                        <div key={index} className="leading-tight flex">
                            <BiX className="self-center cursor-pointer text-white hover:text-red-600" onClick={() => removeMember(email)} />
                            <span>{email}</span>
                        </div>
                    );
                })}
            </div>
            <button
                id="submit"
                disabled={!canSubmit}
                className={`${(!canSubmit || isLoading)
                    ? "text-re-gray-300  border-re-gray-300"
                    : "border-re-green-300"
                    } border-2 rounded-md py-1 font-theinhardt-300 text-white text-lg w-1/4 mt-4`}
            >
                Update
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
