"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import DoubleInputField from "../form/double-input-field";
import InputField from "../form/input-field";

type POFormProps = {
    orderString: string;
};

export default function POForm({
    orderString,
}: POFormProps) {
    const [inputValue, setInputValue] = useState({ bankName: "", accountNumber: "", routingNumber: "" });
    const { bankName, accountNumber, routingNumber } = inputValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(inputValue);
    };

    const [buyerName, setBuyerName] = useState<string>("");
    const [buyerBillingAddressLine, setBuyerBillingAddressLine] = useState<string>("");
    const [buyerShippingAddressLine, setBuyerShippingAddressLine] = useState<string>("");
    const [buyerPhone, setBuyerPhone] = useState<string>("");
    const [buyerTaxId, setBuyerTaxId] = useState<string>("");
    const [requestioner, setRequestioner] = useState<string>("");
    const [shippedVia, setShippedVia] = useState<string>("");
    const [fobPoint, setFobPoint] = useState<string>("");
    const [terms, setTerms] = useState<string>("");

    return (
        <form
            className="w-1/2 my-4 flex-col"
        >
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Your Info</div>
                    <div className="p-0 my-0">
                        <input
                            name={"Name"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t"}
                            type="text"
                            value={buyerName}
                            placeholder={"Name"}
                            onChange={(e) => setBuyerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"Billing Address Line"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800"}
                            type="text"
                            value={buyerBillingAddressLine}
                            placeholder={"Billing Address Line"}
                            onChange={(e) => setBuyerBillingAddressLine(e.target.value)}
                            required
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"Shipping Address Line"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800"}
                            type="text"
                            value={buyerShippingAddressLine}
                            placeholder={"Shipping Address Line"}
                            onChange={(e) => setBuyerShippingAddressLine(e.target.value)}
                            required
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"Phone Number"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800"}
                            type="text"
                            value={buyerPhone}
                            placeholder={"Phone Number"}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Payment Info</div>
                    {/* TODO(Suhana): Make sure required fields are enforced correctly */}
                    {/* TODO(Suhana): Use the field components for the rest of the inputs as well */}
                    <InputField top required={true} placeholder={"Bank Name"} value={bankName} name={"bankName"} onChange={handleChange} />
                    <DoubleInputField leftName="accountNumber" leftPlaceholder="Account Number" leftValue={accountNumber} required={true} rightName="routingNumber" rightPlaceholder="Routing Number" rightValue={routingNumber} onChange={handleChange} />
                    <div className="p-0 my-0">
                        <input
                            name={"EIN"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-b-2 mb-2 rounded-b"}
                            type="text"
                            value={buyerTaxId}
                            placeholder={"EIN"}
                            onChange={(e) => setBuyerTaxId(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Other Info</div>
                    <div className="p-0 my-0">
                        <input
                            name={"Requestioner"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t"}
                            type="text"
                            value={requestioner}
                            placeholder={"Requestioner"}
                            onChange={(e) => setRequestioner(e.target.value)}
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"Shipped Via"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800"}
                            type="text"
                            value={shippedVia}
                            placeholder={"Shipped Via"}
                            onChange={(e) => setShippedVia(e.target.value)}
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"FOB Point"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800"}
                            type="text"
                            value={fobPoint}
                            placeholder={"FOB Point"}
                            onChange={(e) => setFobPoint(e.target.value)}
                        />
                    </div>
                    <div className="p-0 my-0">
                        <input
                            name={"Terms"}
                            className={"p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-b-2 mb-2 rounded-b"}
                            type="text"
                            value={terms}
                            placeholder={"Terms"}
                            onChange={(e) => setTerms(e.target.value)}
                        />
                    </div>
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
                        buyerTaxId: buyerTaxId,
                        routingNumber: routingNumber,
                        accountNumber: accountNumber,
                        requestioner: requestioner,
                        shippedVia: shippedVia,
                        fobPoint: fobPoint,
                        terms: terms
                    },
                }}>
                <button
                    id="submit"
                    className={`${orderString === ""
                        ? "text-re-gray-300 border-1/2 border-re-gray-300"
                        : "bg-re-blue"
                        }  rounded-md py-1 font-theinhardt-300 text-white text-lg w-full`}
                    disabled={orderString == ""}
                >
                    Go to PDF
                </button>

            </Link>
        </form>

    );
}