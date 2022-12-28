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

export default function POForm({
    company,
    locations,
    orderString,
    products,
    skus,
    type,
    user,
}: CheckoutProps) {
    return (
        <Link
            className={`w-1/2 my-4 ${orderString == "" && "pointer-events-none"}`}
            href={{
                pathname: "/po/pdf",
                query: {
                    orderString: orderString,
                },
            }}
        >
            <div className="flex flex-col my-1 w-1/2 mx-auto">
                <button
                    className={`${orderString === ""
                        ? "text-re-gray-300 border-1/2 border-re-gray-300"
                        : "bg-re-blue"
                        }  rounded-md py-1 font-theinhardt-300 text-white text-lg w-full`}
                    disabled={orderString == ""}
                >
                    Go to PDF
                </button>

            </div>
        </Link>

    );
}
