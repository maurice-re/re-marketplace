"use client";

import {
    Company,
    Location,
    Product,
    ProductDevelopment,
    Sku,
    User,
} from "@prisma/client";
import { CheckoutType } from "../../utils/checkoutUtils";
import Link from "next/link";
import { saveToLocalStorage } from "../../utils/form/localStorage";
import { FormEvent } from "react";
import DoubleAddressField from "../form/double-address-field";
import AddressField from "../form/address-field";
import { useRouter } from "next/navigation";

type CheckoutProps = {
    company?: Company;
    locations?: Location[];
    loggedIn?: boolean;
    orderString: string;
    productDevelopment?: ProductDevelopment;
    products?: Product[];
    skus?: Sku[];
    type: CheckoutType;
    user?: User;
};

// TODO(Suhana): Remove uneccess
export default function POForm({
    company,
    locations,
    orderString,
    products,
    skus,
    type,
    user,
}: CheckoutProps) {
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log("Inside PO handleSubmit()");
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: find a better way to do parse form
        const formElements = (e.target as any).elements as HTMLInputElement[];
        const poInfo: string[] = [];
        for (let i = 0; i < formElements.length - 1; i++) {
            console.log(formElements[i].value);
            poInfo.push(formElements[i].value);
        }

        saveToLocalStorage(
            [poInfo],
            ["poInfo"]
        );

        router.replace("/po/pdf");

        // TODO(Suhana): Add error display (setMessage)
    };

    return (
        <form
            className="w-1/2 my-4 flex-col"
            onSubmit={handleSubmit}
        >
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Your Company Info</div>
                    <AddressField placeholder="Company Name" top required />
                    <AddressField placeholder="Billing Address Line" required />
                    <AddressField placeholder="Shipping Address Line" required />
                    {/* <AddressField placeholder="Country" required />
                    <DoubleAddressField
                        leftPlaceholder="City"
                        rightPlaceholder="Zip"
                        required
                    />
                    <AddressField placeholder="State" required /> */}
                </div>
            </div>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Buyer Info</div>
                    <AddressField placeholder="Contact Name" top required />
                    <AddressField placeholder="Phone" required />
                    <AddressField placeholder="Tax ID" bottom required />
                </div>
            </div>
            <div>
                <div className="py-4">
                    <div className="text-lg font-semibold">Other Info</div>
                    <AddressField placeholder="Requestioner" top required />
                    <AddressField placeholder="Shipped Via" required />
                    <AddressField placeholder="FOB Point" required />
                    <AddressField placeholder="Terms" bottom required />
                </div>
            </div>
            <div className="flex flex-col my-1 w-1/2 mx-auto">
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

            </div>
        </form>

    );
}
