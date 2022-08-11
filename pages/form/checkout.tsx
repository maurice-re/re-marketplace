import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import CheckoutForm from "../../components/form/checkout-form";
import ReLogo from "../../components/form/re-logo";
import { useFormState } from "../../context/form-context";
import { allLocations } from "../../utils/prisma/cart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const Checkout: NextPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { calculateTotal, cart, locations, setCustomerId } = useFormState();
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

  let items: (JSX.Element | JSX.Element[])[] = [];
  allLocations(cart).forEach((city) => {
    if (locations.length > 1) {
      items.push(
        <div key={"name" + city}>
          <div>{`${city} orders`}</div>
        </div>
      );
    }
    items.push(
      cart.map((order) => {
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
                  height={"100%"}
                  width={"100%"}
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
              <div className="text-sm font-semibold mb-0.5">{`$${(
                order.sku.price * order.quantity
              ).toFixed(2)}`}</div>
              <div className="text-xs text-gray-300">{`\$${order.sku.price} each`}</div>
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
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <Head>
        <title>Checkout</title>
        <meta name="checkout" content="Purchase containers from Re Company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />

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
};

export default Checkout;
