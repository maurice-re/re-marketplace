"use client";

import { Location, Product, ProductDevelopment, Sku } from "@prisma/client";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";
import LineItems from "../checkout/lineItems";
import Totals from "../checkout/totals";

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
    <div className="w-5/6 flex flex-col items-center">
      <div className="flex flex-col w-5/6 text-right">
        <div>Pay Re company</div>
        <div className="text-4xl mb-6">{`$${getCheckoutTotal(
          orderString,
          null,
          products ?? [],
          skus ?? [],
          CheckoutType.ORDER
        )}`}</div>
      </div>
      <LineItems
        locations={locations ?? []}
        orderString={orderString}
        skus={skus ?? []}
        showLocation={false}
        productDevelopment={null}
        products={products ?? []}
        type={type}
      />
      <div className="w-1/3">
        <Totals
          orderString={orderString}
          skus={skus ?? []}
          productDevelopment={null}
          products={products ?? []}
          type={type}
        />
      </div>
    </div>
  );
}
