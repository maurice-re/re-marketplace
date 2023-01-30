"use client";

import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProgressBar from "../../../components/form/progress-bar";
import ReLogo from "../../../components/form/re-logo";
import { CartOrder, FormStore, useFormStore } from "../../../stores/formStore";
import { allLocations } from "../../../utils/form/cart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function Page() {
  const [eol, checkEol] = useState<boolean>(false);
  const { calculateTotal, cart, skipToCheckout } = useFormStore((state: FormStore) => ({
    calculateTotal: state.calculateTotal,
    cart: state.cart,
    skipToCheckout: state.skipToCheckout,
  }));
  const searchParams = useSearchParams();

  const checkout = searchParams.get("checkout");

  useEffect(() => {
    if (typeof checkout == "string") {
      skipToCheckout(checkout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const eolBorderColor = eol
    ? " border-re-green-500 group-hover:border-re-green-700"
    : " border-white group-hover:border-re-green-500";

  let items: JSX.Element[] = [];
  allLocations(cart).forEach((city) => {
    let first = 1;
    const topBorder = items.length == 0 ? "" : " border-t-4";
    items.push(
      <div
        className={"flex flex-col border-white" + topBorder}
        key={city + " border"}
      >
        <div className=" text-white text-25 pl-8 pt-4">{city}</div>
        {cart.map((order: CartOrder) => {
          if (order.location != city) {
            return;
          }
          first -= 1;
          return (
            <div key={city + order.sku.id}>
              {first < 0 && <div className=" bg-white w-11/12 h-0.5 mx-auto" />}
              <div className="flex justify-evenly py-4">
                <div>
                  <Image
                    src={order.product.mainImage}
                    height={160}
                    width={160}
                    alt={"takeout front"}
                    className="rounded-2xl"
                  />
                </div>
                <div className="flex flex-col justify-center w-68">
                  <div className={"text-sm-25 text-white font-theinhardt"}>
                    {order.sku.size}
                  </div>
                  <div className={"text-sm-25 text-white font-theinhardt"}>
                    {(
                      order.sku.materialShort +
                      " " +
                      order.product.name
                    ).padEnd(22)}
                  </div>
                  <div className="text-28 text-white font-theinhardt font-bold">
                    {"x " + order.quantity}
                  </div>
                </div>
                <div className="self-end">
                  <div>
                    <button className="text-white text-25 font-theinhardt-300 border-2 border-white px-4 py-1 rounded-10 mr-2">
                      Edit
                    </button>
                    <button className="text-white hover:text-red-400 text-28">
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="w-screen h-screen bg-re-black flex">
      <head>
        <title>Your perfect setup</title>
        <meta name="summary" content="Review your perfect setup" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ProgressBar pageName="summary" />
      <ReLogo />
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <h1 className="text-5xl font-theinhardt text-white text-center">
          Your perfect setup
        </h1>
        <div className="bg-re-gray-500 h-104 rounded-2xl w-7/10 overflow-auto">
          {items}
        </div>
        <div className="group relative px-2 pt-2">
          {eol && (
            <div className="bg-re-green-500 h-6 w-6 z-10 rounded-full pl-1 absolute right-0 top-0 group-hover:bg-re-green-700">
              <Image
                src="/icons/check.png"
                height={10}
                width={15}
                alt="check mark"
              />
            </div>
          )}
          <button
            className={
              "border-2 text-25 text-white font-theinhardt-300 py-1 px-6 rounded-10" +
              eolBorderColor
            }
            onClick={() => checkEol((prev) => !prev)}
          >
            Agree to EOL policy
          </button>
        </div>
        <Link href={"form/checkout"}>
          <button
            className={
              "bg-re-green-500 w-124 text-25 font-theinhardt rounded-10 py-2 disabled:bg-gray-300 text-black"
            }
            type="submit"
            role="link"
            disabled={!eol}
          >
            {`Checkout: \$${(calculateTotal() * 1.07).toFixed(2)}`}
          </button>
        </Link>
      </main>
    </div>
  );
}
