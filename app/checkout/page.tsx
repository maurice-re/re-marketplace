import { Company, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { CheckoutType } from "../../utils/checkoutUtils";
import CheckoutLeft from "./checkoutLeft";

export default async function Page({
  searchParams,
}: {
  searchParams: { orderString: string };
}) {
  const { orderString } = searchParams;

  if (orderString == null) {
    return <div>An error occurred</div>;
  }

  // Product Development
  if (orderString.startsWith("product-development")) {
    const [_, devId] = orderString.split("~");
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
      })!;
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
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }
  const user = session.user as User;
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    include: { locations: true },
  });
  const products = await prisma.product.findMany({});
  const skus = await prisma.sku.findMany({});

  return (
    <CheckoutLeft
      company={JSON.parse(JSON.stringify(company))! as Company}
      locations={JSON.parse(JSON.stringify(company!.locations))}
      orderString={orderString}
      products={products}
      skus={skus}
      type={CheckoutType.ORDER}
      user={JSON.parse(JSON.stringify(user))}
    />
  );
}
