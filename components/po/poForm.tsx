"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import DoubleInputField from "../form/double-input-field";
import InputField from "../form/input-field";

type POFormProps = {
    orderString: string;
};

type POFormInputs = {
    buyerPhone: string;
    buyerCity: string;
    buyerState: string;
    buyerZip: string;
    buyerCountry: string;
    buyerAddressLine: string;
    buyerCompany: string;
    requestioner: string;
    shippedVia: string;
    fobPoint: string;
    terms: string;
    buyerEmail: string;
};

export default function POForm({
    orderString,
}: POFormProps) {
    const [inputValues, setInputValues] = useState<POFormInputs>({ buyerPhone: "", buyerCity: "", buyerState: "", buyerZip: "", buyerCountry: "", buyerAddressLine: "", buyerCompany: "", requestioner: "", shippedVia: "", fobPoint: "", terms: "", buyerEmail: "" });
    const { terms, buyerPhone, buyerCity, buyerState, buyerZip, buyerCountry, buyerAddressLine, buyerCompany, requestioner, shippedVia, fobPoint, buyerEmail } = inputValues;
    // TODO(Suhana): Pass in all of the new fields, and create the new ones, and pass it all in

    const canSubmit = () => {
        // Check for required fields
        if (orderString !== "" && buyerPhone !== "" && buyerCity !== "" && buyerState !== "" && buyerZip !== "" && buyerCompany !== "" && buyerAddressLine !== "" && buyerCompany !== "" && buyerEmail !== "") {
            return true;
        } else {
            return false;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form
            className="w-1/2 my-4 flex-col"
        >
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Contact Info</div>
                    <InputField top required placeholder={"Name"} value={buyerCompany} name={"buyerCompany"} onChange={handleChange} />
                    <InputField required placeholder={"Address Line"} value={buyerAddressLine} name={"buyerAddressLine"} onChange={handleChange} />
                    <DoubleInputField required leftPlaceholder={"City"} leftValue={buyerCity} leftName={"buyerCity"} rightPlaceholder={"State"} rightValue={buyerState} rightName={"buyerState"} onChange={handleChange} />
                    <DoubleInputField required leftPlaceholder={"Zip"} leftValue={buyerZip} leftName={"buyerZip"} rightPlaceholder={"Country"} rightValue={buyerCountry} rightName={"buyerCountry"} onChange={handleChange} />
                    <InputField required placeholder={"Phone Number"} value={buyerPhone} name={"buyerPhone"} onChange={handleChange} />
                    <InputField required placeholder={"Email"} value={buyerEmail} name={"buyerEmail"} onChange={handleChange} />
                </div>
            </div>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Order Info</div>
                    <InputField top placeholder={"Requestioner"} value={requestioner} name={"requestioner"} onChange={handleChange} />
                    <InputField placeholder={"Shipped Via"} value={shippedVia} name={"shippedVia"} onChange={handleChange} />
                    <InputField placeholder={"FOB Point"} value={fobPoint} name={"fobPoint"} onChange={handleChange} />
                    <InputField bottom placeholder={"Terms"} value={terms} name={"terms"} onChange={handleChange} />
                </div>
            </div>
            <Link
                className={`flex flex-col my-1 w-1/2 mx-auto${orderString == "" && "pointer-events-none"}`}
                href={{
                    pathname: "/po/pdf",
                    query: {
                        orderString: orderString,
                        buyerCompany: buyerCompany,
                        buyerAddressLine: buyerAddressLine,
                        buyerCity: buyerCity,
                        buyerState: buyerState,
                        buyerZip: buyerZip,
                        buyerCountry: buyerCountry,
                        buyerPhone: buyerPhone,
                        buyerEmail: buyerEmail,
                        requestioner: requestioner,
                        shippedVia: shippedVia,
                        fobPoint: fobPoint,
                        terms: terms,
                    },
                }}>
                <button
                    className={`${!canSubmit()
                        ? "text-re-gray-300 border-1/2 border-re-gray-300"
                        : "bg-re-blue"
                        } self-center rounded-md py-1 font-theinhardt-300 text-white text-lg w-full`}
                    disabled={!canSubmit()}
                >
                    Go to PDF
                </button>

            </Link>
        </form>

    );
}