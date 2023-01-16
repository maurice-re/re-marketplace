"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignInForm({ emails }: { emails: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // If email exists in database, then sign in
    if (emails.includes(email)) {
      await signIn("email", { email: email });
    }
    // If email does not exist in database, but company does, then create user and sign in
    else {
      router.push(`/signup?email=${email}`);
    }
  }

  return (
    <div className="flex flex-col bg-re-dark-green-400 border-[0.5px] border-re-gray-500 rounded min-w-56 w-1/4">
      <h1 className="mx-4 my-5 text-xl">Sign in</h1>
      <div className="h-0.5 w-full bg-re-gray-500"></div>
      <form className="flex flex-col mx-4 text-lg my-5" onSubmit={handleSignIn}>
        <label className="text-re-gray-text mb-1">
          Email
          <input
            type={"email"}
            required
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <button
          className={`w-full bg-re-purple-500 text-white text-lg rounded py-1 mt-5 hover:bg-re-purple-600 active:bg-re-purple-500 btn ${
            loading ? "loading" : ""
          }`}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
