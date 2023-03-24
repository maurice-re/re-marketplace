"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CartOrder } from "../../../stores/formStore";
import { allLocations } from "../../../utils/form/cart";

export default function Page() {
  const [cart, setCart] = useState<CartOrder[]>([]);

  useEffect(() => {
    // Retrieve from local storage
    const cart: string | null = localStorage.getItem("cart");
    const shippingInfo: string | null = localStorage.getItem("shipping");
    const customerId: string | null = localStorage.getItem("customerId");
    // Send to Firebase
    if (cart != null && shippingInfo != null && customerId != null) {
      const jCart: CartOrder[] = JSON.parse(cart);
      const jForm: string[] = JSON.parse(shippingInfo);
      const jId: string = JSON.parse(customerId);
      createAndSignIn(jCart, jForm, jId);
      localStorage.clear();
      setCart(jCart);
    }
  }, []);

  async function createAndSignIn(
    cart: CartOrder[],
    form: string[],
    customerId: string
  ) {
    await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: cart,
        form: form,
        customerId: customerId,
      }),
    })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    signIn("email", {
      redirect: false,
      email: form[2],
      callbackUrl: "/dashboard",
    });
  }

  const items: (JSX.Element | JSX.Element[])[] = [];
  allLocations(cart).forEach((city) => {
    items.push(
      <div>
        <div>{`${city} orders`}</div>
      </div>
    );
    items.push(
      cart.map((order) => {
        if (order.location != city) {
          return <div key={order.sku.id + city} />;
        }
        return (
          <div
            className="flex columns-2 justify-between items-center mr-4 my-4"
            key={order.sku.id + city}
          >
            <div className="flex columns-2 justify-start items-center">
              <div className="h-16 w-16 overflow-hidden rounded place-content-center mr-3">
                <Image
                  src={order.product.mainImage}
                  alt={"takeout front"}
                  height={64}
                  width={64}
                />
              </div>
              <div>
                <div className="text-md font-semibold mb-0.5">
                  {`${order.sku.size} ${order.sku.materialShort} ${order.product.name}`}
                </div>
                <div className="text-sm text-gray-300">{`Qty ${order.quantity}`}</div>
              </div>
            </div>
          </div>
        );
      })
    );
    items.push(<div className="h-8" />);
  });

  return (
    <div className="w-screen h-screen bg-re-black flex overflow-hidden">
      <head>
        <title>Congrats</title>
        <meta
          name="successful purchase"
          content="Congrats on making a purchase"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main className="flex flex-col container mx-auto items-center py-4 text-white">
        <Confetti width={1800} height={1200} />
        <h1 className="text-5xl font-theinhardt text-white text-center">
          Congrats on your purchase!
        </h1>
        <div className=" mt-16 border-2 rounded-xl px-8 pt-8">{items}</div>
        <div className="border-2 border-white px-8 py-4 mt-4 text-center rounded-md">
          <div>Want to manage your order?</div>
          <div>Check your email</div>
        </div>
      </main>
    </div>
  );
}
