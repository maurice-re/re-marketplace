import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import ReLogo from "../../components/form/re-logo";
import SampleOrder from "../../components/sample/sampleOrder";
import prisma from "../../constants/prisma";
import { SkuProduct } from "../../utils/dashboard/dashboardUtils";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

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
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <div className="text-white font-theinhardt text-28">
          Welcome to sample page
        </div>
        <SampleOrder skus={skus} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
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
  }
  return { props: {} };
};

export default Home;
