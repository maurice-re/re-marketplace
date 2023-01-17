"use client";

import {
    Company,
    Location,
    Product,
    ProductDevelopment,
    Sku,
    User,
} from "@prisma/client";
import ReLogo from "../form/re-logo";
import { CheckoutType } from "../../utils/checkoutUtils";
import POItems from "./poItems";
import POForm from "./poForm";

type POSummaryProps = {
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

export default function POSummary({
    company,
    locations,
    orderString,
    products,
    skus,
    type,
    user,
}: POSummaryProps) {

    console.log("In PO page, got ", orderString);

    return (
        <div className="w-full h-screen bg-black flex items-start justify-center text-white">
            <ReLogo />
            <div className="w-full flex">
                <POItems
                    company={JSON.parse(JSON.stringify(company)) as Company}
                    locations={JSON.parse(JSON.stringify(company?.locations))}
                    orderString={orderString}
                    products={products}
                    skus={skus}
                    type={CheckoutType.ORDER}
                    user={JSON.parse(JSON.stringify(user))}
                />
                <POForm
                    company={JSON.parse(JSON.stringify(company)) as Company}
                    locations={JSON.parse(JSON.stringify(company?.locations))}
                    orderString={orderString}
                    products={products}
                    skus={skus}
                    type={CheckoutType.ORDER}
                    user={JSON.parse(JSON.stringify(user))}
                />
            </div>
        </div>
    );
}
