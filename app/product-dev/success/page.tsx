"use client";

import Confetti from "react-confetti";

export default function Page() {
  return (
    <div className="w-screen h-screen bg-re-black flex overflow-hidden">
      <head>
        <title>Thank You for your Order</title>
        <meta
          name="successful product development purchase"
          content="Congrats on making a purchase"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main className="flex flex-col container mx-auto items-center py-4 text-white justify-center">
        <Confetti width={1800} height={1200} />
        <h1 className="text-5xl font-theinhardt text-white text-center mt-10">
          Thank you for your purchase
        </h1>
        <h1 className="text-3xl font-theinhardt text-white text-center mt-6">
          {"We'll be in touch shortly"}
        </h1>
      </main>
    </div>
  );
}
