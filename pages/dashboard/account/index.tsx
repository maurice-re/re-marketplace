import { Company, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";

type AccountProps = {
  user: User & {
    company: Company;
  };
};

const AccountHome: NextPage<AccountProps> = ({ user }) => {

  if (!user) {
    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Account</title>
            <meta name="locations" content="Manage your account" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
            <div className="text-white font-theinhardt text-28">Coming Soon</div>
          </main>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="w-full h-screen bg-black flex overflow-auto">
        <Head>
          <title>Account</title>
          <meta name="account" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex w-full justify-between px-8">
            <div className="flex flex-col font-theinhardt justify-center">
              <h1 className="text-3xl">Manage Your Account</h1>
              <h3 className="text-xl font-theinhardt-300">{`${user.firstName} ${user.lastName} | ${user.company.name}`}</h3>

            </div>
            <div className="avatar placeholder">
              <div className=" bg-re-green-500 text-black rounded-full w-24">
                <span className="text-3xl">K</span>
              </div>
            </div>
          </div>
          <div className="divider" />
        </main>
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? "",
      },
      include: {
        company: true,
      },
    });
    return {
      props: {
        user: JSON.parse(JSON.stringify(user!)),
      },
    };
  }
  return { props: {} };
};

export default AccountHome;
