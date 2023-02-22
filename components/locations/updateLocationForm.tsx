"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { User, Company, LocationType, Penalty, TrackingType, Location } from "@prisma/client";
import InputField from "../form/input-field";
import DoubleInputField from "../form/double-input-field";
import DropdownField from "../form/dropdown-field";
import { BsArrowRight } from "react-icons/bs";
import { BiX } from "react-icons/bi";

type UpdateLocationFormInputs = {
    city: string;
    country: string;
    displayName: string;
    line1: string;
    line2: string;
    penalty: Penalty;
    shippingName: string;
    state: string;
    trackingType: TrackingType;
    type: LocationType;
    zip: string;
    ownerEmail: string;
    ownerEmails: string[];
    viewerEmail: string;
    viewerEmails: string[];
};

// TODO(Suhana): Make sure they can edit settings from tracking

export default function UpdateLocationForm({ location, user, initialOwnerEmails, initialViewerEmails }: { location: Location; user: User; initialOwnerEmails: string[], initialViewerEmails: string[]; }) {
    const initialLocationValues: UpdateLocationFormInputs = {
        city: location.city ?? "",
        country: location.country ?? "",
        displayName: location.displayName ?? "",
        line1: location.line1 ?? "",
        line2: location.line2 ?? "",
        penalty: location.penalty,
        shippingName: location.shippingName ?? "",
        state: location.state ?? "",
        trackingType: location.trackingType,
        type: location.type,
        zip: location.zip ?? "",
        ownerEmail: "",
        ownerEmails: initialOwnerEmails, // The creator of the location must be an owner
        viewerEmail: "",
        viewerEmails: initialViewerEmails,
    };
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState<UpdateLocationFormInputs>(initialLocationValues);
    const [errorInputValues, setErrorInputValues] = useState<UpdateLocationFormInputs>();
    const [successInputValues, setSuccessInputValues] = useState<UpdateLocationFormInputs>();
    const {
        city,
        country,
        displayName,
        line1,
        line2,
        penalty,
        shippingName,
        state,
        trackingType,
        type,
        zip,
        ownerEmail,
        ownerEmails,
        viewerEmail,
        viewerEmails
    } = inputValues;

    const checkCanSubmit = () => {
        // Check that required fields were entered
        if (city != "" &&
            country != "" &&
            displayName != "" &&
            (line1 != "" || line2 != "") &&
            shippingName != "" &&
            state != "" &&
            zip != "" &&
            inputValues !== errorInputValues &&
            inputValues !== successInputValues &&
            inputValues !== initialLocationValues
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
        console.log("Set ", name, " to ", value);
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
            const res = await fetch(`/api/locations/location?userId=${user.id}&locationId=${location.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    city: city,
                    country: country,
                    displayName: displayName,
                    line1: line1,
                    line2: line2,
                    penalty: penalty,
                    shippingName: shippingName,
                    state: state,
                    trackingType: trackingType,
                    type: type,
                    zip: zip,
                    ownerEmails: ownerEmails,
                    viewerEmails: viewerEmails,
                    locationId: location.id,
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

    const addUser = (owner: boolean) => {
        if (owner) {
            // Owner
            if (ownerEmail !== "") {
                ownerEmails.push(ownerEmail);
                // Clear owner email
                setInputValues((prev) => ({
                    ...prev,
                    ["ownerEmail"]: "",
                }));
            }
        } else {
            // Viewer
            if (viewerEmail !== "") {
                viewerEmails.push(viewerEmail);
                // Clear viewer email
                setInputValues((prev) => ({
                    ...prev,
                    ["viewerEmail"]: "",
                }));
            }
        }
        setCanSubmit(checkCanSubmit());
    };

    const removeUser = (owner: boolean, emailToRemove: string) => {
        if (owner) {
            console.log("Removing owner");
            const index = ownerEmails.indexOf(emailToRemove);
            ownerEmails.splice(index, 1);
            setInputValues((prev) => ({
                ...prev,
                ["ownerEmails"]: ownerEmails,
            }));
        }
        else {
            console.log("Removing viewer");
            const index = viewerEmails.indexOf(emailToRemove);
            viewerEmails.splice(index, 1);
            setInputValues((prev) => ({
                ...prev,
                ["viewerEmails"]: viewerEmails,
            }));
        }
        setCanSubmit(checkCanSubmit());
    };

    const getPlaceholder = (value: string | null, placeholder: string) => {
        if (value && value !== "") {
            return value;
        } else {
            return placeholder;
        }
    };

    const trackingTypes = [TrackingType.NONE, TrackingType.USER, TrackingType.CONTAINER, TrackingType.BOTH];
    const penalties = [Penalty.NONE, Penalty.DEPOSIT];
    const locationTypes = [LocationType.SHIPPING, LocationType.SAMPLE, LocationType.TRACKING];

    return (
        <form id="add-location-form" className="justify-center items-center flex w-full flex-col" onSubmit={handleSubmit}>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Address</div>
                <InputField top placeholder={getPlaceholder(location.displayName, "Display Name")} value={displayName} name={"displayName"} onChange={handleChange} />
                <InputField placeholder={getPlaceholder(location.shippingName, "Location Name")} value={shippingName} name={"shippingName"} onChange={handleChange} />
                <InputField placeholder={getPlaceholder(location.line1, "Address Line 1")} value={line1} name={"line1"} onChange={handleChange} />
                <InputField placeholder={getPlaceholder(location.line2, "Address Line 2")} value={line2} name={"line2"} onChange={handleChange} />
                <DoubleInputField leftPlaceholder={getPlaceholder(location.city, "City")} leftValue={city} leftName={"city"} rightPlaceholder={getPlaceholder(location.state, "State")} rightValue={state} rightName={"state"} onChange={handleChange} />
                <DoubleInputField bottom leftPlaceholder={getPlaceholder(location.zip, "Zip")} leftValue={zip} leftName={"zip"} rightPlaceholder={getPlaceholder(location.country, "Country")} rightValue={country} rightName={"country"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Tracking Type</div>
                <DropdownField top bottom options={trackingTypes} placeholder={"Tracking Type"} value={trackingType} name={"trackingType"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Shipping Type</div>
                <DropdownField top bottom options={locationTypes} placeholder={"Location Type"} value={type} name={"type"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Pricing Penalty</div>
                <DropdownField top bottom options={penalties} placeholder={"Penalty"} value={penalty} name={"penalty"} onChange={handleChange} />
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Owners</div>
                <div className='w-full flex'>
                    <div className="w-full">
                        <InputField top bottom placeholder={"Owner Email"} value={ownerEmail} name={"ownerEmail"} onChange={handleChange} />
                    </div>
                    <div className="justify-center items-center">
                        <BsArrowRight className={`self-center my-4 justify-center items-center ml-4 ${viewerEmail !== "" && "cursor-pointer"}`} size={25} onClick={() => addUser(true)} />
                    </div>
                </div>
                {ownerEmails.map((email, index) => {
                    return (
                        <div key={index} className="leading-tight flex">
                            <BiX className="self-center cursor-pointer text-white hover:text-red-600" onClick={() => removeUser(true, email)} />
                            <span>{email}</span>
                        </div>
                    );
                })}
            </div>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Viewers</div>
                <div className='w-full flex'>
                    <div className="w-full">
                        <InputField top bottom placeholder={"Viewer Email"} value={viewerEmail} name={"viewerEmail"} onChange={handleChange} />
                    </div>
                    <div className="justify-center items-center">
                        <BsArrowRight className={`self-center my-4 justify-center items-center ml-4 ${viewerEmail !== "" && "cursor-pointer"}`} size={25} onClick={() => addUser(false)} />
                    </div>
                </div>
                {viewerEmails.map((email, index) => {
                    return (
                        <div key={index} className="leading-tight flex">
                            <BiX className="self-center cursor-pointer text-white hover:text-red-600" onClick={() => removeUser(false, email)} />
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
