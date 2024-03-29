"use client";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
import { SampleOrderWithSkuID } from "../../../utils/sample/sampleUtils";

import CheckoutForm from "../../../components/sample/checkoutForm";
import { saveToLocalStorage } from "../../../utils/form/localStorage";
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../../utils/prisma/dbUtils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function Check({
  transaction,
  skus,
}: {
  transaction: SampleOrderWithSkuID;
  skus: SkuProduct[];
}) {
  const [clientSecret, setClientSecret] = useState("");
  // const [paymentId, setPaymentId] = useState("");
  // const [paymentMethods, setPaymentMethods] = useState<
  //   PaymentMethod[] | undefined
  // >();
  const total = (): number => {
    if (transaction) {
      return transaction.amount;
    }
    return 0;
  };

  useEffect(() => {
    fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cost: total(),
        id: "",
        sample: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        saveToLocalStorage([data.customerId], ["customerId"]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appearance: Appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#58FEC4",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const items: (JSX.Element | JSX.Element[])[] = [];

  skus.forEach((sku) => {
    items.push(
      <div
        className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
        key={sku.id}
      >
        <div className="flex columns-2 justify-start items-center">
          <div className="h-12 w-12 overflow-hidden rounded place-content-center mr-3">
            <Image
              src={sku.mainImage}
              alt={sku.product.name}
              height={48}
              width={48}
            />
          </div>
          <div>
            <div className="text-sm font-semibold mb-0.5">
              {sku.size + " " + sku.materialShort + " " + sku.product.name}
            </div>
            <div className="text-xs text-gray-300">{`Qty ${transaction.quantity}`}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-0.5 text-right">{`$${calculatePriceFromCatalog(
            sku,
            sku.id,
            transaction.quantity
          )}`}</div>
          <div className="text-xs text-gray-300">{`$${getPriceFromTable(
            sku.priceTable,
            transaction.quantity
          )} each`}</div>
        </div>
      </div>
    );
  });
  items.push(
    <div className="flex columns-2 pl-16 justify-between mr-4 mb-8" key={"tax"}>
      <div>
        <div className="text-sm font-semibold mb-0.5">Shipping</div>
        <div className="text-xs text-gray-300">{`Shenzen to you 7-10 days`}</div>
      </div>
      <div className="text-right ">
        <div className="text-sm font-semibold mb-0.5">Calculated later</div>
      </div>
    </div>
  );
  return (
    <main className="flex p-6 columns-2 mx-20 my-1 h-screen">
      <div className="flex-column items-start w-1/2 h-full overflow-auto mr-4">
        <h2 className="text-lg">Pay Re Company</h2>
        <h1 className=" text-4xl font-semibold pb-4">{`$${total().toFixed(
          2
        )}`}</h1>
        <h2 className="text-md">Sample orders</h2>
        {items}
        <div className="ml-16 mr-4 border my-4" />
        <div className="flex columns-2 pl-16 justify-between mr-4 mb-0.5 text-gray-200">
          <div>
            <div className="text-sm font-semibold mb-0.5">Subtotal</div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-0.5">{`$${(
              total() / 1.07
            ).toFixed(2)}`}</div>
          </div>
        </div>
        <div className="flex columns-2 pl-16 justify-between mr-4 mb-4 text-gray-300">
          <div>
            <div className="text-xs font-semibold mb-0.5">Tax (7%)</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-0.5">{`$${(
              total() -
              total() / 1.07
            ).toFixed(2)}`}</div>
          </div>
        </div>
        <div className="flex columns-2 pl-16 justify-between mr-4 mb-8">
          <div>
            <div className="text-sm font-semibold mb-0.5">Total due</div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-0.5">{`$${total().toFixed(
              2
            )}`}</div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full">
        {clientSecret && (
          // eslint-disable-next-line
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm transaction={transaction} />
          </Elements>
        )}
      </div>
    </main>
  );
}
