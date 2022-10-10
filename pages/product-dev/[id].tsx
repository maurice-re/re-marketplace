import { ProductDevelopment } from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReLogo from "../../components/form/re-logo";
import CheckoutForm from "../../components/product-dev/checkoutForm";
import prisma from "../../constants/prisma";

type ProductDevProps = {
  productDev: ProductDevelopment | null;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const ProductDevelopment: NextPage<ProductDevProps> = ({ productDev }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    if (productDev != null) {
      fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cost: (productDev.developmentFee + productDev.researchFee) * 0.5,
          id: "",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setCustomerId(data.customerId);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDev]);

  if (productDev == null) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Product Development</title>
          <meta name="locations" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            This does not exist
          </div>
        </main>
      </div>
    );
  }

  if (productDev.initiationPaid) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Product Development</title>
          <meta name="locations" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-center py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            This has already been paid for
          </div>
          <div className="text-white font-theinhardt text-28 mt-3">
            {"We'll be in touch!"}
          </div>
        </main>
      </div>
    );
  }

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

  const total = (
    (productDev.developmentFee + productDev.researchFee) *
    0.5
  ).toFixed(2);
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <Head>
        <title>Checkout</title>
        <meta name="checkout" content="Purchase containers from Re Company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />
      <meta name="viewport" content="width=device-width, minimum-scale=1" />
      <main className="flex p-6 columns-2 mx-20 my-1 h-screen">
        <div className="flex-column items-start w-1/2 h-full overflow-auto mr-4">
          <h2 className="text-lg">Pay Re Company</h2>
          <h1 className=" text-4xl font-semibold pb-4">{`\$${total}`}</h1>
          <div className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8">
            <div className="flex columns-2 justify-start items-center">
              <div className="h-12 w-12 overflow-hidden rounded-10 flex mr-3 border items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div className="text-sm font-semibold mb-0.5">
                Design Research
              </div>
            </div>
            <div className="text-sm font-semibold mb-0.5">{`$${productDev.researchFee}`}</div>
          </div>
          <div className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8">
            <div className="flex columns-2 justify-start items-center">
              <div className="h-12 w-12 overflow-hidden rounded-10 flex mr-3 border items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.867 19.125h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <div className="text-sm font-semibold mb-0.5">
                Product Development
              </div>
            </div>
            <div className="text-sm font-semibold mb-0.5">{`$${productDev.developmentFee}`}</div>
          </div>
          <div className="ml-16 mr-6 border my-4" />
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200 text-xs">
            <div className="">
              <div className="mb-0.5">50% due on initiation</div>
            </div>
            <div className="">
              <div className="mb-0.5">{`\$${
                (productDev.developmentFee + productDev.researchFee) * 0.5
              }`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200">
            <div className="">
              <div className="text-xs mb-0.5">50% due on completion</div>
            </div>
            <div className="">
              <div className="text-xs mb-0.5">{`\$${
                (productDev.developmentFee + productDev.researchFee) * 0.5
              }`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200 text-sm">
            <div className="">
              <div className="font-semibold mb-0.5">Subtotal</div>
            </div>
            <div className="">
              <div className="font-semibold mb-0.5">{`\$${
                productDev.developmentFee + productDev.researchFee
              }`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-8 mt-4">
            <div className="">
              <div className="text-sm font-bold mb-0.5">Total due today</div>
            </div>
            <div className="">
              <div className="text-sm font-bold mb-0.5">{`\$${total}`}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                customerId={customerId}
                companyName={productDev.companyName}
                id={productDev.id}
              />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const productDev = await prisma.productDevelopment.findUnique({
    where: {
      id: id as string,
    },
  });
  return {
    props: {
      productDev: JSON.parse(JSON.stringify(productDev)),
    },
  };
};

export default ProductDevelopment;
