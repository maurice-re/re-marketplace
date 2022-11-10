import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import StorePage from "./store";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }
  const user = session.user as User;

  const skus = await prisma.sku.findMany({});
  const products = await prisma.product.findMany({});
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    include: {
      locations: {
        include: {
          orderItems: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  return (
    <StorePage
      company={company!}
      initialLocations={company!.locations}
      products={products}
      skus={skus}
    />
  );
}
