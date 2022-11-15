import Head from "next/head";
import ReLogo from "../../../components/form/re-logo";
import prisma from "../../../constants/prisma";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
import { SampleOrderWithSkuID } from "../../../utils/sample/sampleUtils";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Checkout from "./checkout";

type Props = {
  searchParams?: {
    transaction?: string;
  };
};

export default async function Page(props: Props) {

  const { searchParams } = props;

  const transaction = searchParams?.transaction;

  if (!transaction) {
    return <div>An error occurred</div>;
  }

  const session = await unstable_getServerSession(authOptions);
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
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <Head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />

      <Checkout transaction={transactionObj} skus={skus} />
    </div>
  );
}