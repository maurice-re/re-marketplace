"use client";

import { User } from ".prisma/client";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignUpForm({
  admin,
  email,
}: {
  admin: User | undefined;
  email: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<Record<string, string>>({});

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        hasCompany: !!admin,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        company: admin ? admin.companyId : userInfo.company,
      }),
    });
    if (res.status === 200) {
      await signIn("email", { email: email });
    } else {
      console.log("Error creating user");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col bg-re-dark-green-400 border-[0.5px] border-re-gray-500 rounded min-w-56 w-1/4">
      <h1 className="mx-4 my-5 text-xl">Create Account</h1>
      <div className="h-0.5 w-full bg-re-gray-500"></div>
      <form className="flex flex-col mx-4 text-lg my-5" onSubmit={handleSignIn}>
        <label className="text-re-gray-text mb-1">
          Email
          <input
            type={"email"}
            required
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={email}
            disabled
          ></input>
        </label>
        <label className="text-re-gray-text mb-1">
          First Name
          <input
            type={"text"}
            required
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={userInfo["firstName"]}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
          ></input>
        </label>
        <label className="text-re-gray-text mb-1">
          Last Name
          <input
            type={"text"}
            required
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={userInfo["lastName"]}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
          ></input>
        </label>
        {!admin && (
          <label className="text-re-gray-text mb-1">
            Company Name
            <input
              type={"text"}
              required
              className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
              value={userInfo["company"]}
              onChange={(e) =>
                setUserInfo({ ...userInfo, company: e.target.value })
              }
            ></input>
          </label>
        )}
        <button
          className={`w-full bg-re-purple-500 text-white text-lg rounded py-1 mt-5 hover:bg-re-purple-600 active:bg-re-purple-500 btn ${
            loading ? "loading" : ""
          }`}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
