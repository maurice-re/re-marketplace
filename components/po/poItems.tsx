"use client";

import {
    Company,
    Location,
    Product,
    ProductDevelopment,
    Sku,
    User,
} from "@prisma/client";
import LineItems from "../checkout/lineItems";
import Totals from "../checkout/totals";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";

type POItemsProps = {
    locations?: Location[];
    loggedIn?: boolean;
    orderString: string;
    productDevelopment?: ProductDevelopment;
    products?: Product[];
    skus?: Sku[];
    type: CheckoutType;
};

export default function POItems({
    locations,
    orderString,
    products,
    skus,
    type,
}: POItemsProps) {
    return (
        <div className="flex flex-col my-1 w-1/2">
            <div className="flex-col items-start w-full h-full overflow-auto mr-4">
                <h2 className="text-lg">Pay Re Company</h2>
                <h1 className=" text-4xl font-semibold pb-4">{`$${getCheckoutTotal(
                    orderString,
                    null,
                    products ?? [],
                    skus ?? [],
                    type
                )}`}</h1>
                {LineItems({
                    locations: locations ?? [],
                    orderString: orderString,
                    skus: skus ?? [],
                    productDevelopment: null,
                    products: products ?? [],
                    type: type,
                })}
                <div className="ml-16 mr-6 border my-4" />
                {Totals({
                    orderString: orderString,
                    skus: skus ?? [],
                    productDevelopment: null,
                    products: products ?? [],
                    type: type,
                })}
            </div>
        </div>
    );
}
