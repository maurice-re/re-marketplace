import { getServerSession } from "next-auth";
import Head from "next/head";
import ReLogo from "../../../components/form/re-logo";
import { prisma } from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
import { SampleOrderWithSkuID } from "../../../utils/sample/sampleUtils";
import Checkout from "./checkout";

export default async function Page(props: {
  searchParams?: {
    transaction?: string;
  };
}) {
  const { searchParams } = props;

  const transaction = searchParams?.transaction;

  if (!transaction) {
    return <div>An error occurred</div>;
  }

  const session = await getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }

  const skuIds: string[] = JSON.parse(transaction).skuIds.split(", ");
  const transactionObj: SampleOrderWithSkuID = JSON.parse(transaction);

  const skus: SkuProduct[] = await prisma.sku.findMany({
    where: {
      id: { in: skuIds },
    },
    include: {
      product: true,
    },
  });

  return (
    <div className="w-screen h-screen bg-re-black flex items-center justify-center text-white">
      <Head>
        <title>Sample Checkout</title>
        <meta name="description" content="Order samples from Re company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />

      <Checkout transaction={transactionObj} skus={skus} />
    </div>
  );
}
