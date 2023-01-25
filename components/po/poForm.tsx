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
    buyerShippingAddressLine: string;
    buyerBillingAddressLine: string;
    buyerName: string;
    requestioner: string;
    shippedVia: string;
    fobPoint: string;
    terms: string;
    buyerEmail: string;
};

export default function POForm({
    orderString,
}: POFormProps) {
    const [inputValues, setInputValues] = useState<POFormInputs>({ buyerPhone: "", buyerShippingAddressLine: "", buyerBillingAddressLine: "", buyerName: "", requestioner: "", shippedVia: "", fobPoint: "", terms: "", buyerEmail: "" });
    const { terms, buyerPhone, buyerShippingAddressLine, buyerBillingAddressLine, buyerName, requestioner, shippedVia, fobPoint, buyerEmail } = inputValues;
    // TODO(Suhana): Pass in all of the new fields, and create the new ones, and pass it all in

    const canSubmit = () => {
        // Check for required fields
        if (orderString !== "" && buyerPhone !== "" && buyerShippingAddressLine !== "" && buyerBillingAddressLine !== "" && buyerName !== "" && buyerEmail !== "") {
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
                    <InputField top required placeholder={"Name"} value={buyerName} name={"buyerName"} onChange={handleChange} />
                    <InputField required placeholder={"Billing Address Line"} value={buyerBillingAddressLine} name={"buyerBillingAddressLine"} onChange={handleChange} />
                    <InputField required placeholder={"Billing Shipping Line"} value={buyerShippingAddressLine} name={"buyerShippingAddressLine"} onChange={handleChange} />
                    <InputField required placeholder={"Email"} value={buyerEmail} name={"buyerEmail"} onChange={handleChange} />
                    <InputField bottom required placeholder={"Phone Number"} value={buyerPhone} name={"buyerPhone"} onChange={handleChange} />
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
                        buyerName: buyerName,
                        buyerBillingAddressLine: buyerBillingAddressLine,
                        buyerShippingAddressLine: buyerShippingAddressLine,
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