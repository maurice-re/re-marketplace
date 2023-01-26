export const dynamic = "force-dynamic";

import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LineItems from "../../components/checkout/lineItems";
import ReLogo from "../../components/form/re-logo";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";
import CheckoutLeft from "./checkoutLeft";
import Payment from "./payment";

export default async function Page({
  searchParams,
}: {
  searchParams?: { orderString: string; };
}) {
  if (!(searchParams && searchParams.orderString)) {
    return <div>An error occurred</div>;
  }

  const { orderString } = searchParams;

  // Product Development
  if (orderString.startsWith("product-development")) {
    const [, devId] = orderString.split("~");
    const productDev = await prisma.productDevelopment.findUnique({
      where: { id: devId },
    });

    if (productDev == null) {
      // TODO: Handle error
      return <div>An error has occurred</div>;
    }

    if (productDev.companyId == null) {
      return (
        <CheckoutLeft
          orderString={orderString}
          productDevelopment={productDev}
          type={CheckoutType.PRODUCT_DEVELOPMENT}
        />
      );
    } else {
      const session = await unstable_getServerSession(authOptions);
      const company = await prisma.company.findUnique({
        where: { id: productDev.companyId },
      });

      if (company == null) {
        //TODO: Handle error
        return <div>An error has occurred</div>;
      }

      const sessionUser = session == null ? null : (session?.user as User);
      return (
        <CheckoutLeft
          company={company}
          productDevelopment={productDev}
          loggedIn={
            sessionUser == null ? false : sessionUser?.companyId == company.id
          }
          orderString={orderString}
          type={CheckoutType.PRODUCT_DEVELOPMENT}
          user={sessionUser ?? undefined}
        />
      );
    }
  }

  // Order
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    redirect("/signin");
  }
  const user = session.user as User;
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
  });

  if (company == null) {
    redirect("404");
  }

  const products = await prisma.product.findMany({});
  const skus = await prisma.sku.findMany({});

  const { clientSecret, paymentIntentId, paymentMethods } = await fetch(
    `${process.env.NEXTAUTH_URL}/api/payment/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cost: getCheckoutTotal(
          orderString,
          null,
          products ?? [],
          skus ?? [],
          CheckoutType.ORDER
        ),
        id: company.customerId,
      }),
    }
  ).then((res) => res.json());

  return (
    <div className="w-full h-full min-h-screen bg-re-dark-green-500 flex flex-col font-theinhardt text-white items-center p-6 pt-10 justify-center">
      <ReLogo />
      <div className="flex flex-col w-5/6 text-right pt-10">
        <div>Total Payment</div>
        <div className="text-4xl mb-6">{`$${getCheckoutTotal(
          orderString,
          null,
          products,
          skus,
          CheckoutType.ORDER
        )}`}</div>
      </div>
      <LineItems
        locations={[]}
        orderString={orderString}
        skus={skus}
        showLocation
        productDevelopment={null}
        products={products}
        type={CheckoutType.ORDER}
      />
      <Payment
        company={company}
        orderString={orderString}
        type={CheckoutType.ORDER}
        clientSecret={clientSecret}
        customerId={company.customerId}
        paymentIntentId={paymentIntentId}
        paymentMethods={paymentMethods}
        products={products}
        user={user}
        skus={skus}
      />
    </div>
  );
}
