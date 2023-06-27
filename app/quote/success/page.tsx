"use client";

import Confetti from "react-confetti";

export default function Page() {
  return (
    <div className="flex h-screen bg-re-black">
      <main className="container mx-auto my-auto flex flex-col items-center py-4 text-white">
        <Confetti width={1800} height={1200} />
        <h1 className="text-center font-theinhardt text-5xl text-white">
          {"Thanks! We'll be in touch soon"}
        </h1>
        <div className="mt-10 rounded-md border-2 border-white px-8 py-4 text-center">
          <div>
            You will receive an email confirming your quote request shortly
          </div>
        </div>
      </main>
    </div>
  );
}
