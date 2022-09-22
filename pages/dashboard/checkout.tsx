import { Company, Location, Product, Sku, User } from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, PaymentMethod } from "@stripe/stripe-js";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import CheckoutInfo from "../../components/dashboard/checkoutInfo";
import ReLogo from "../../components/form/re-logo";
import prisma from "../../constants/prisma";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../utils/prisma/dbUtils";
import { authOptions } from "../api/auth/[...nextauth]";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

type CheckoutProps = {
  company: Company | null;
  locations: Location[];
  orderString: string;
  products: Product[];
  skus: Sku[];
  user: User | null;
};

const DashboardCheckout: NextPage<CheckoutProps> = ({
  company,
  locations,
  orderString,
  products,
  skus,
  user,
}: CheckoutProps) => {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[] | undefined
  >();

  const subtotal = getOrderStringTotal(orderString, skus, products);
  const total = getOrderStringTotal(orderString, skus, products, 1.07);
  useEffect(() => {
    fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cost: total,
        id: company ? company.customerId : "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentId(data.paymentId);
        setPaymentMethods(data.paymentMethods);
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

  orderString.split("*").forEach((ordersByLocation) => {
    const locationId = ordersByLocation.split("_")[0];
    const lineItems = ordersByLocation.split("_").slice(1);
    const location = locations?.find((loc) => loc.id == locationId);

    if (orderString.split("*").length > 1) {
      items.push(
        <div key={"name " + locationId}>
          <div>{`${
            location ? location.displayName ?? location.city : location
          } orders`}</div>
        </div>
      );
    }
    items.push(
      lineItems.map((lineItem) => {
        const [skuId, quantity] = lineItem.split("~");
        console.log(orderString);
        const sku: Sku = skus.find((s) => s.id == skuId)!;
        const product: Product = products.find((p) => (p.id = sku.productId))!;
        return (
          <div
            className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
            key={skuId + location ?? locationId}
          >
            <div className="flex columns-2 justify-start items-center">
              <div className="h-12 w-12 overflow-hidden rounded place-content-center mr-3">
                <Image
                  src={sku.mainImage}
                  alt={product.name}
                  height={"100%"}
                  width={"100%"}
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">
                  {sku.size + " " + sku.materialShort + " " + product.name}
                </div>
                <div className="text-xs text-gray-300">{`Qty ${quantity}`}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5">{`$${calculatePriceFromCatalog(
                sku,
                sku.id,
                quantity
              )}`}</div>
              <div className="text-xs text-gray-300">{`\$${getPriceFromTable(
                sku.priceTable,
                quantity
              )} each`}</div>
            </div>
          </div>
        );
      })
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-8"
        key={"tax " + locationId}
      >
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Shipping</div>
          <div className="text-xs text-gray-300">
            {location
              ? `Shenzen to ${location.city} 7-10 days`
              : `Ships from Shenzen 7-14 days`}
          </div>
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
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />

      <main className="flex p-6 columns-2 mx-20 my-1 h-screen">
        <div className="flex-column items-start w-1/2 h-full overflow-auto mr-4">
          <h2 className="text-lg">Pay Re Company</h2>
          <h1 className=" text-4xl font-semibold pb-4">{`$${total}`}</h1>
          {items}
          <div className="ml-16 mr-6 border my-4" />
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Subtotal</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${subtotal}`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-4 text-gray-300">
            <div className="">
              <div className="text-xs font-semibold mb-0.5">Tax (7%)</div>
            </div>
            <div className="">
              <div className="text-xs font-semibold mb-0.5">{`$${
                total - subtotal
              }`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-8">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Total due</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${total}`}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutInfo
                company={company != null ? company : ({} as Company)}
                locations={locations}
                orderString={orderString}
                paymentMethods={paymentMethods}
                paymentId={paymentId}
                products={products}
                skus={skus}
                user={user != null ? user : ({} as User)}
              />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderString } = context.query;
  if (typeof orderString == "string") {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
      include: {
        company: {
          include: {
            locations: true,
          },
        },
      },
    });

    const allSkus = await prisma.sku.findMany();
    const allProducts = await prisma.product.findMany();
    return {
      props: {
        company: user
          ? JSON.parse(JSON.stringify(user.company as Company))
          : null,
        user: user ? JSON.parse(JSON.stringify(user as User)) : null,
        locations: user ? (user.company.locations as Location[]) : [],
        orderString: orderString,
        products: allProducts,
        skus: allSkus,
      },
    };
  }

  return { props: {} };
};

export default DashboardCheckout;
