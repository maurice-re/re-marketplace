import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, PaymentMethod } from "@stripe/stripe-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import CheckoutInfo from "../../components/dashboard/checkoutInfo";
import ReLogo from "../../components/form/re-logo";
import prisma from "../../constants/prisma";
import {
  OrderCustomerLocation,
  OrderSkuProduct,
  separateByLocationId,
  totalFromOrders,
  TransactionCustomerOrders,
} from "../../utils/dashboard/dashboardUtils";
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../utils/prisma/dbUtils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

type CheckoutProps = {
  transaction?: TransactionCustomerOrders;
  order?: OrderCustomerLocation;
};

const DashboardCheckout: NextPage<CheckoutProps> = ({
  order,
  transaction,
}: CheckoutProps) => {
  console.log(order);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[] | undefined
  >();
  const total = (): number => {
    if (transaction) {
      return totalFromOrders(transaction.orders);
    }
    if (order) {
      return totalFromOrders([order]);
    }
    return 0;
  };

  const customerId = (): string => {
    if (transaction) {
      return transaction.company.customerId;
    }
    if (order) {
      return order.company.customerId;
    }
    return "";
  };

  useEffect(() => {
    const taxTotal = parseFloat((total() * 1.07).toFixed(2));
    console.log(taxTotal);
    fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cost: taxTotal,
        id: customerId(),
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
  const orders = (): OrderSkuProduct[][] => {
    if (transaction) {
      return separateByLocationId(transaction.orders);
    }
    if (order) {
      return separateByLocationId([order]);
    }
    return [];
  };

  orders().forEach((cityArr) => {
    if (true) {
      items.push(
        <div key={"name" + cityArr[0].id}>
          <div>{`${
            cityArr[0].location.displayName ?? cityArr[0].location.city
          } orders`}</div>
        </div>
      );
    }
    items.push(
      cityArr.map((order) => {
        return (
          <div
            className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
            key={order.sku.id + cityArr[0].locationId}
          >
            <div className="flex columns-2 justify-start items-center">
              <div className="h-12 w-12 overflow-hidden rounded place-content-center mr-3">
                <Image
                  src={order.sku.mainImage}
                  alt={order.sku.product.name}
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
                    order.sku.product.name}
                </div>
                <div className="text-xs text-gray-300">{`Qty ${order.quantity}`}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5">{`$${calculatePriceFromCatalog(
                order.sku,
                order.sku.product,
                order.sku.id,
                order.quantity
              )}`}</div>
              <div className="text-xs text-gray-300">{`\$${getPriceFromTable(
                order.sku.product.priceTable,
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
        key={"tax" + cityArr[0].locationId}
      >
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Shipping</div>
          <div className="text-xs text-gray-300">{`Shenzen to ${cityArr[0].location.city} 7-10 days`}</div>
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
          <h1 className=" text-4xl font-semibold pb-4">{`$${(
            total() * 1.07
          ).toFixed(2)}`}</h1>
          {items}
          <div className="ml-16 mr-6 border my-4" />
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Subtotal</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${total().toFixed(
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
                total() * 0.07
              ).toFixed(2)}`}</div>
            </div>
          </div>
          <div className="flex columns-2 pl-16 justify-between mr-6 mb-8">
            <div className="">
              <div className="text-sm font-semibold mb-0.5">Total due</div>
            </div>
            <div className="">
              <div className="text-sm font-semibold mb-0.5">{`$${(
                total() * 1.07
              ).toFixed(2)}`}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutInfo
                order={order}
                transaction={transaction}
                paymentMethods={paymentMethods}
                paymentId={paymentId}
              />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderId, orders, test, transactionId } = context.query;

  if (typeof transactionId == "string") {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        company: {
          select: {
            customerId: true,
          },
        },
        orders: {
          include: {
            sku: {
              include: {
                product: true,
              },
            },
            location: true,
          },
        },
      },
    });
    return {
      props: {
        transaction: JSON.parse(JSON.stringify(transaction)),
      },
    };
  }

  if (typeof orderId == "string") {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        company: {
          select: {
            customerId: true,
          },
        },
        sku: {
          include: {
            product: true,
          },
        },
        location: true,
      },
    });
    return {
      props: {
        order: JSON.parse(JSON.stringify(order)),
      },
    };
  }

  if (typeof orders == "string") {
    console.log(orders);
    return {
      props: {
        transaction: JSON.parse(orders),
      },
    };
  }
  return { props: {} };
};

export default DashboardCheckout;
