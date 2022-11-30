"use client";

import { ProductDevelopment } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

type ProductDevProps = {
  loggedIn: boolean | null;
  productDev: ProductDevelopment | null;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function ProductDevelopmentPage({
  loggedIn,
  productDev,
}: ProductDevProps) {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  if (productDev == null) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <head>
          <title>Product Development</title>
          <meta name="locations" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </head>
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
        <head>
          <title>Product Development</title>
          <meta name="locations" content="Proposal already paid for" />
          <link rel="icon" href="/favicon.ico" />
        </head>
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
      <head>
        <title>Product Development</title>
        <meta name="account" content="Sign in to view proposal" />
        <link rel="icon" href="/favicon.ico" />
      </head>
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
}
