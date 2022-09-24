import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import ReLogo from "../../components/form/re-logo";
import SampleOrder from "../../components/sample/sampleOrder";
import prisma from "../../constants/prisma";
import { SkuProduct } from "../../utils/dashboard/dashboardUtils";

type HomeProps = {
  skus: SkuProduct[];
};

const Home: NextPage<HomeProps> = ({ skus }: HomeProps) => {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <Head>
        <title>Sample</title>
        <meta name="locations" content="Manage locations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />
      <main className="flex flex-col w-full container mx-auto h-full justify-start py-3 items-start pr-5">
        <div className="ml-1 font-theinhardt text-4xl pt-10 text-left">
          Order Samples
        </div>
        <div className="ml-1 font-theinhardt text-xl py-5 pb-20 text-left">
          Select one or more products to proceed to checkout and try out Re!
        </div>
        <SampleOrder skus={skus} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const skus = await prisma.sku.findMany({
    include: {
      product: true,
    },
  });
  return {
    props: {
      skus: JSON.parse(JSON.stringify(skus)),
    },
  };
};

export default Home;
