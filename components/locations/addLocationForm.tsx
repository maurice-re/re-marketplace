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
            //   const res = await fetch("/api/user/create-peer-user", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //       companyId: user.companyId, // newUser.companyId for adding user to diff company
            //       firstName: newUser.firstName,
            //       lastName: newUser.lastName,
            //       email: newUser.email,
            //       newCompanyName: "", // newUser.newCompanyName for adding user to diff company
            //       newCompanyCustomerId: "", // newUser.newCompanyCustomerId for adding user to diff company
            //     }),
            //   });
            // if (res.status != 200) {
            //     setErrorUser(newLocation);
            // } else {
            //     setSuccessUser(newLocation);
            // }
            //   const { message } = await res.json();
            //   setMessage(message);

            setIsLoading(false);
        }
    };

    const trackingTypes = [TrackingType.NONE, TrackingType.USER, TrackingType.CONTAINER, TrackingType.BOTH];
    const penalties = [Penalty.NONE, Penalty.DEPOSIT];
    const locationTypes = [LocationType.SHIPPING, LocationType.SAMPLE, LocationType.TRACKING];

    return (
        <form id="add-location-form" onSubmit={handleSubmit}>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Add Location Form</div>
                    <InputField top placeholder={"Display Name"} value={displayName} name={"displayName"} onChange={handleChange} />
                    <InputField placeholder={"Shipping Name"} value={shippingName} name={"shippingName"} onChange={handleChange} />
                    <InputField placeholder={"Address Line 1"} value={line1} name={"line1"} onChange={handleChange} />
                    <InputField placeholder={"Address Line 2"} value={line2} name={"line2"} onChange={handleChange} />
                    <DoubleInputField leftPlaceholder={"City"} leftValue={city} leftName={"city"} rightPlaceholder={"State"} rightValue={state} rightName={"state"} onChange={handleChange} />
                    <DoubleInputField leftPlaceholder={"Zip"} leftValue={zip} leftName={"zip"} rightPlaceholder={"Country"} rightValue={country} rightName={"country"} onChange={handleChange} />
                    <DropdownField options={trackingTypes} placeholder={"Tracking Type"} value={trackingType} name={"trackingType"} onChange={handleChange} />
                    <DropdownField options={locationTypes} placeholder={"Location Type"} value={type} name={"type"} onChange={handleChange} />
                    <DropdownField options={penalties} placeholder={"Penalty"} value={penalty} name={"penalty"} onChange={handleChange} />
                </div>
            </div>
            <button
                disabled={undefined}
                id="submit"
                className={`btn btn-accent btn-outline w-28 mt-5 ${isLoading ? "loading" : ""
                    }`}
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
