import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AddressField from "../../components/form/address-field";
import ProgressBar from "../../components/form/progress-bar";
import ReLogo from "../../components/form/re-logo";
import { useFormStore } from "../../stores/formStore";
import { allLocations } from "../../utils/form/cart";

const Quote: NextPage = () => {
  const { cart, locations, prettyString } = useFormStore((state) => ({
    cart: state.cart,
    locations: state.locations,
    prettyString: state.prettyString,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    let shippingInfo: string[] = [];
    for (let i = 0; i < formElements.length - 1; i++) {
      shippingInfo.push(formElements[i].value);
    }
    setIsLoading(true);
    const message = `New quote requested through product matching tool! \n Name: ${
      shippingInfo[0]
    } \n Email: ${shippingInfo[1]} \n Company Name: ${
      shippingInfo[2]
    } \n Cart: ${prettyString()}`;

    await fetch("/api/mail/send-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
    setSubmitted(true);
  };

  let items: JSX.Element[] = [];
  allLocations(cart).forEach((city) => {
    let first = 1;
    const topBorder = items.length == 0 ? "" : " border-t-2 my-4";
    items.push(
      <div
        className={"flex flex-col border-white" + topBorder}
        key={city + " border"}
      >
        {locations.length > 1 && (
          <div className=" text-white text-28 pl-8 pt-4 mb-2">{city}</div>
        )}
        <div className="flex flex-wrap justify-evenly" key={city + "items"}>
          {cart.map((order) => {
            if (order.location != city) {
              return;
            }
            first -= 1;
            return (
              <div key={city + order.sku.id} className=" w-2/5 py-2">
                <div className="flex justify-evenly">
                  <div>
                    <Image
                      src={order.product.mainImage}
                      height={100}
                      width={100}
                      alt={"takeout front"}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Your perfect setup</title>
        <meta name="quote" content="Get a quote for perfect setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName="quote" />
      <ReLogo />
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <h1 className="text-5xl font-theinhardt text-white text-center mb-6 mt-4">
          Your perfect setup
        </h1>
        <div className="bg-re-gray-500 max-h-[26rem] rounded-2xl w-7/10 overflow-auto py-8">
          {items}
        </div>
        <div className="group relative px-2 pt-2">
          <form id="quote form" onSubmit={handleSubmit}>
            <div className=" w-96">
              <div className="pb-4 text-white">
                <AddressField placeholder="Name" top required />
                <AddressField placeholder="Email" required />
                <AddressField placeholder="Company Name" bottom required />
              </div>
            </div>
            <div className="flex w-full place-content-center">
              {!submitted && (
                <button
                  disabled={isLoading}
                  id="submit"
                  className=" bg-re-green-500 px-4 py-2 w-1/2 mb-4 rounded-md hover:bg-aquamarine-400 place-content-center flex"
                >
                  {isLoading ? (
                    <div className=" animate-spin h-6 w-6 border-t-2 border-l-2 border-black rounded-full" />
                  ) : (
                    <span className="text-black text-base font-medium">
                      Request a Quote
                    </span>
                  )}
                </button>
              )}
              {submitted && (
                <div className="flex flex-col w-full items-center">
                  <div className=" bg-re-green-500 px-4 py-2 w-3/5 mb-2 rounded-md hover:bg-aquamarine-400 place-content-center flex">
                    <span className="text-black text-base font-medium">
                      {"We'll be in touch shortly!"}
                    </span>
                  </div>
                  <Link href={"https://www.re.company/how-it-works"} replace>
                    <div className="text-white hover:text-re-green-500 cursor-pointer hover:underline">
                      How it works
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Quote;
