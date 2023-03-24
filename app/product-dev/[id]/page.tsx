import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import ProductDevelopmentPage from "./productDevelopment";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const productDevelopment = await prisma.productDevelopment.findUnique({
    where: { id: id },
  });

  if (productDevelopment == null) {
    return <div>An error occurred</div>;
  }

  // If new company go straight to checkout
  if (productDevelopment != null && productDevelopment.companyId == null) {
    redirect("/checkout?orderString=product-development~" + id);
  }

  // If company exists check if signed in
  if (productDevelopment != null && productDevelopment.companyId != null) {
    const session = await unstable_getServerSession(authOptions);

    if (
      session == null ||
      (session.user as User).companyId != productDevelopment.companyId
    ) {
      return (
        <ProductDevelopmentPage
          loggedIn={false}
          productDev={productDevelopment}
        />
      );
    }
    redirect("/checkout?orderString=product-development~" + id);
  }
}
