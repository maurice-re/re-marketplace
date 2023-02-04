import { ChangeEvent, FormEvent, useState } from "react";
import { User, Company, LocationType, Penalty, TrackingType } from "@prisma/client";
import InputField from "../form/input-field";
import DoubleInputField from "../form/double-input-field";
import DropdownField from "../form/dropdown-field";

type AddLocationFormInputs = {
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
};

// TODO(Suhana): Make sure they can edit settings from tracking

export default function AddLocationForm({ user, company }: { user: User; company: Company; }) {
    const [inputValues, setInputValues] = useState<AddLocationFormInputs>({
        city: "",
        country: "",
        displayName: "",
        line1: "",
        line2: "",
        penalty: Penalty.NONE,
        shippingName: "",
        state: "",
        trackingType: TrackingType.BOTH,
        type: LocationType.SHIPPING,
        zip: "",
    });
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
    } = inputValues;

    const canSubmit = () => {
        // Check that required fields were entered
        if (city != "" &&
            country != "" &&
            displayName != "" &&
            (line1 != "" ||
                line2 != "") &&
            shippingName != "" &&
            state != "" &&
            zip != "") {
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
            const res = await fetch("/api/locations/add-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
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
                }),
            });
            if (res.status != 200) {
                const { id } = await res.json();
                setMessage(id);
                console.log("Created new location with ID ", id);
            } else {

            }

            setIsLoading(false);
        }
    };

    const trackingTypes = [TrackingType.NONE, TrackingType.USER, TrackingType.CONTAINER, TrackingType.BOTH];
    const penalties = [Penalty.NONE, Penalty.DEPOSIT];
    const locationTypes = [LocationType.SHIPPING, LocationType.SAMPLE, LocationType.TRACKING];

    return (
        <form id="add-location-form" className="justify-center items-center flex w-1/2 flex-col" onSubmit={handleSubmit}>
            <div className="pt-2 w-full">
                <div className="text-lg font-semibold">Address</div>
                <InputField top placeholder={"Display Name"} value={displayName} name={"displayName"} onChange={handleChange} />
                <InputField placeholder={"Shipping Name"} value={shippingName} name={"shippingName"} onChange={handleChange} />
                <InputField placeholder={"Address Line 1"} value={line1} name={"line1"} onChange={handleChange} />
                <InputField placeholder={"Address Line 2"} value={line2} name={"line2"} onChange={handleChange} />
                <DoubleInputField leftPlaceholder={"City"} leftValue={city} leftName={"city"} rightPlaceholder={"State"} rightValue={state} rightName={"state"} onChange={handleChange} />
                <DoubleInputField bottom leftPlaceholder={"Zip"} leftValue={zip} leftName={"zip"} rightPlaceholder={"Country"} rightValue={country} rightName={"country"} onChange={handleChange} />
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
            {message && (
                <div
                    id="error-message"
                    className={`font-theinhardt text-left mt-4 ${true ? "text-error" : "text-re-green-500"}`}
                >
                    {message}
                </div>
            )}
        </form>
    );
}
