import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Confetti from "react-confetti";
import { SampleOrderWithSkuID } from "../../utils/sample/sampleUtils";

const Summary: NextPage = () => {
  useEffect(() => {
    // Retrieve from local storage
    const transaction: string | null = localStorage.getItem("transaction");
    const shippingInfo: string | null = localStorage.getItem("shipping");
    const customerId: string | null = localStorage.getItem("customerId");
    // Send to Firebase
    if (transaction != null && shippingInfo != null) {
      const jTransaction: SampleOrderWithSkuID = JSON.parse(transaction);
      const jForm: string[] = JSON.parse(shippingInfo);
      create(jTransaction, jForm, customerId);
      localStorage.clear();
    }
  }, []);

  async function create(
    transaction: SampleOrderWithSkuID,
    form: string[],
    customerId: string | null
  ) {
    if (transaction && form) {
      await fetch("/api/sample/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: transaction,
          form: form,
          customerId: customerId,
        }),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  return (
    <div className="w-screen h-screen bg-black flex overflow-hidden">
      <Head>
        <title>Congrats</title>
        <meta
          name="successful purchase"
          content="Congrats on making a purchase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col container mx-auto items-center py-4 text-white my-auto">
        <Confetti width={1800} height={1200} />
        <h1 className="text-5xl font-theinhardt text-white text-center">
          Congrats on your purchase!
        </h1>
        <div className="border-2 border-white px-8 py-4 mt-10 text-center rounded-md">
          <div>Your sample order is on the way</div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
