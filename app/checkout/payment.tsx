"use client";

import {
  Company,
  Location,
  Product,
  ProductDevelopment,
  Sku,
  User,
} from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, PaymentMethod } from "@stripe/stripe-js";
import { useState } from "react";
import { eolPolicy } from "../../constants/policy";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";
import CheckoutRight from "./checkoutRight";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#58FEC4",
  },
};

type CheckoutProps = {
  clientSecret: string;
  company?: Company;
  customerId: string;
  locations?: Location[];
  loggedIn?: boolean;
  orderString: string;
  paymentIntentId: string;
  paymentMethods: PaymentMethod[];
  productDevelopment?: ProductDevelopment;
  products?: Product[];
  skus?: Sku[];
  type: CheckoutType;
  user?: User;
};

export default function Payment({
  clientSecret,
  company,
  customerId,
  locations,
  orderString,
  paymentIntentId,
  paymentMethods,
  productDevelopment,
  products,
  skus,
  type,
  user,
}: CheckoutProps) {
  const [eol, setEol] = useState(false);

  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div className="w-1/3 self-center mt-5">
      <input type="checkbox" id="eol-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Agree to our End Of Life Policy</h3>
          <p className="py-4">{eolPolicy}</p>
          <div className="modal-action">
            <label
              htmlFor="eol-modal"
              className="btn btn-error btn-outline"
              onClick={() => setEol(false)}
            >
              Disagree
            </label>
            <label
              htmlFor="eol-modal"
              className="btn btn-accent btn-outline"
              onClick={() => setEol(true)}
            >
              Agree
            </label>
          </div>
        </div>
      </div>

      <div className="flex-grow font-theinhardt">
        <div className="px-10 flex justify-between text-lg">
          <div>Subtotal</div>
          <div>
            {`$${getOrderStringTotal(
              orderString,
              products ?? [],
              skus ?? []
            ).toFixed(2)}`}
          </div>
        </div>
        <div className="px-10 flex justify-between text-re-gray-text">
          <div>Tax (7%)</div>
          <div>{`$${(
            getOrderStringTotal(orderString, products ?? [], skus ?? []) * 0.07
          ).toFixed(2)}`}</div>
        </div>
        <div className="px-10 flex justify-between text-lg">
          <div>Total Payment</div>
          <div>
            {`$${getCheckoutTotal(
              orderString,
              null,
              products ?? [],
              skus ?? [],
              CheckoutType.ORDER
            ).toFixed(2)}
            `}
          </div>
        </div>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutRight
              company={JSON.parse(JSON.stringify(company ?? null))}
              customerId={customerId}
              eol={eol}
              locations={JSON.parse(JSON.stringify(locations ?? []))}
              orderString={orderString}
              paymentMethods={paymentMethods}
              paymentIntentId={paymentIntentId}
              productDevelopment={productDevelopment ?? null}
              products={products ?? []}
              skus={skus ?? []}
              type={type}
              user={user ?? null}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
