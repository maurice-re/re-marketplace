import { ProductDevelopment, User } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import prisma from "../../constants/prisma";
import { authOptions } from "../api/auth/[...nextauth]";

type ProductDevProps = {
  loggedIn: boolean;
  productDev: ProductDevelopment | null;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const ProductDevelopment: NextPage<ProductDevProps> = ({
  loggedIn,
  productDev,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isNewCompany =
      productDev != null &&
      productDev.initiationPaid == false &&
      productDev.companyId == null;

    const isLoggedIn =
      productDev != null &&
      productDev.initiationPaid == false &&
      productDev.companyId != null &&
      loggedIn;

    if (isNewCompany || isLoggedIn) {
      router.push({
        pathname: "/checkout",
        query: { orderString: `product-development~${productDev.id}` },
      });
    }
  }, [loggedIn, productDev, router]);

  if (productDev == null) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Product Development</title>
          <meta name="locations" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            This does not exist
          </div>
        </main>
      </div>
    );
  }

  if (productDev.initiationPaid) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Product Development</title>
          <meta name="locations" content="Proposal already paid for" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-center py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            This has already been paid for
          </div>
          <div className="text-white font-theinhardt text-28 mt-3">
            {"We'll be in touch!"}
          </div>
        </main>
      </div>
    );
  }

  async function logIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElements = (e.target as any).elements as HTMLInputElement[];
    const email = formElements[0].value;
    setLoading(true);
    signIn("email", {
      email: email,
      callbackUrl: `/product-dev/${productDev?.id}`,
    });
    setLoading(false);
  }

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Product Development</title>
        <meta name="account" content="Sign in to view proposal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input type="checkbox" id="success-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="success-modal"
            className="btn btn-sm btn-circle absolute left-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center">
            Success! Account created
          </h3>
          <p className="py- text-center">Check your email to sign in</p>
        </div>
      </div>
      <main className="flex flex-col container mx-auto h-full justify-center py-3 items-center font-theinhardt">
        <h1 className="text-3xl text-white font-bold mb-4">
          Sign In To View Proposal
        </h1>
        <form className="bg-re-gray-500 rounded-xl p-6 w-96" onSubmit={logIn}>
          <input
            required
            type="text"
            placeholder="Email"
            className="input input-bordered w-full max-w-xs my-2.5"
          />
          <button
            type="submit"
            className={`btn w-full mt-4 btn-accent ${loading ? "loading" : ""}`}
          >
            Sign In
          </button>
        </form>
        <div className="text-error mt-2">{errorText}</div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const productDev = await prisma.productDevelopment.findUnique({
    where: {
      id: id as string,
    },
  });

  // If new company return productDev only
  if (productDev != null && productDev.companyId == null) {
    return {
      props: {
        productDev: JSON.parse(JSON.stringify(productDev)),
      },
    };
  }

  // If company exists check if signed in
  if (productDev != null && productDev.companyId != null) {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
    const sessionUser = session == null ? null : (session?.user as User);
    return {
      props: {
        loggedIn: JSON.parse(
          JSON.stringify(
            sessionUser == null
              ? false
              : sessionUser.companyId == productDev.companyId
          )
        ),
        productDev: JSON.parse(JSON.stringify(productDev)),
      },
    };
  }

  // If no productDev found
  return {
    props: { loggedIn: false, productDev: null },
  };
};

export default ProductDevelopment;
