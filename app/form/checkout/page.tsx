"use client";

import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReLogo from "../../../components/form/re-logo";
import { CartOrder, FormStore, useFormStore } from "../../../stores/formStore";
import { allLocations } from "../../../utils/form/cart";
import { getPriceFromTable } from "../../../utils/prisma/dbUtils";
import CheckoutForm from "./formCheckout";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function Page() {
  const [clientSecret, setClientSecret] = useState("");
  // TODO(Suhana): If form checkout continues, add payment intent ID to this
  // const [paymentIntentId, setPaymentIntentId] = useState("");
  const { calculatePrice, calculateTotal, cart, locations, setCustomerId } =
    useFormStore((state: FormStore) => ({
      calculatePrice: state.calculatePrice,
      calculateTotal: state.calculateTotal,
      cart: state.cart,
      locations: state.locations,
      setCustomerId: state.setCustomerId,
    }));
  const total = calculateTotal();

  useEffect(() => {
    const taxTotal = parseFloat((calculateTotal() * 1.07).toFixed(2));
    fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cost: taxTotal, id: "" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCustomerId(data.customerId);
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
  allLocations(cart).forEach((city) => {
    if (locations.length > 1) {
      items.push(
        <div key={"name" + city}>
          <div>{`${city} orders`}</div>
        </div>
      );
    }
    items.push(
      cart.map((order: CartOrder) => {
        if (order.location != city) {
          return (
            <div key={order.location + order.sku.id + "hidden"} hidden></div>
          );
        }
        return (
          <div
            className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
            key={order.sku.id + city}
          >
            <div className="flex columns-2 justify-start items-center">
              <div className="h-12 w-12 overflow-hidden rounded place-content-center mr-3">
                <Image
                  src={order.product.mainImage}
                  alt={"takeout front"}
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">
                  {order.sku.size +
                    " " +
                    order.sku.materialShort +
                    " " +
                    order.product.name}
                </div>
                <div className="text-xs text-gray-300">{`Qty ${order.quantity}`}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5">{`$${calculatePrice(
                order.sku.id,
                order.quantity
              )}`}</div>
              <div className="text-xs text-gray-300">{`$${getPriceFromTable(
                order.sku.priceTable,
                order.quantity
              )} each`}</div>
            </div>
          </div>
        );
      })
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-8"
        key={"tax" + city}
      >
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Shipping</div>
          <div className="text-xs text-gray-300">{`Shenzen to ${city} 7-10 days`}</div>
        </div>
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Calculated later</div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-screen h-screen bg-re-black flex items-center justify-center text-white">
      <head>
        <title>Checkout</title>
        <meta name="checkout" content="Purchase containers from Re Company" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ReLogo />
      <meta name="viewport" content="width=device-width, minimum-scale=1" />
      <main className="flex p-6 columns-2 mx-20 my-1 h-screen">
        <div className="flex-column items-start w-1/2 h-full overflow-auto mr-4">
          <h2 className="text-lg">Pay Re Company</h2>
          <h1 className=" text-4xl font-semibold pb-4">{`$${(
            total * 1.07
          ).toFixed(2)}`}</h1>
          {items}
          <div className="ml-16 mr-6 border my-4" />
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Subtotal</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${total.toFixed(
                2
              )}`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-4 text-gray-300">
            <div className="">
              <div className="text-xs font-semibold mb-0.5">Tax (7%)</div>
            </div>
            <div className="">
              <div className="text-xs font-semibold mb-0.5">{`$${(
                total * 0.07
              ).toFixed(2)}`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-8">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Total due</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${(
                total * 1.07
              ).toFixed(2)}`}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
}
