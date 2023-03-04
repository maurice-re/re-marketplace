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
import { useEffect, useState } from "react";
import LineItems from "../../components/checkout/lineItems";
import Totals from "../../components/checkout/totals";
import ReLogo from "../../components/form/re-logo";
import { eolPolicy } from "../../constants/policy";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";
import { FullLocation } from "../server-store";
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
  company?: Company;
  locations?: FullLocation[];
  loggedIn?: boolean;
  orderString: string;
  productDevelopment?: ProductDevelopment;
  products?: Product[];
  skus?: Sku[];
  type: CheckoutType;
  user?: User;
};

export default function CheckoutLeft({
  company,
  locations,
  orderString,
  productDevelopment,
  products,
  skus,
  type,
  user,
}: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [customerId, setCustomerId] = useState(
    company ? company.customerId : ""
  );
  const [eol, setEol] = useState(false);

  useEffect(() => {
    fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cost: getCheckoutTotal(
          orderString,
          productDevelopment ?? null,
          products ?? [],
          skus ?? [],
          type
        ),
        id: customerId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId ?? "");
        setPaymentMethods(data.paymentMethods ?? []);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div className="w-screen h-screen bg-re-black flex items-center justify-center text-white">
      <ReLogo />
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

      <main className="flex p-6 columns-2 mx-20 my-1 h-screen">
        <div className="flex-column items-start w-1/2 h-full overflow-auto mr-4">
          <h2 className="text-lg">Pay Re Company</h2>
          <h1 className=" text-4xl font-semibold pb-4">{`$${getCheckoutTotal(
            orderString,
            productDevelopment ?? null,
            products ?? [],
            skus ?? [],
            type
          )}`}</h1>
          <LineItems
            locations={locations ?? []}
            orderString={orderString}
            skus={skus ?? []}
            showLocation
            productDevelopment={productDevelopment ?? null}
            products={products ?? []}
            type={type}
          />
          <div className="ml-16 mr-6 border my-4" />
          <Totals
            orderString={orderString}
            skus={skus ?? []}
            productDevelopment={productDevelopment ?? null}
            products={products ?? []}
            type={type}
          />
        </div>
        <div className="w-1/2 h-full">
          {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutRight
                company={company ?? null}
                customerId={customerId}
                eol={eol}
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
      </main>
    </div>
  );
}
