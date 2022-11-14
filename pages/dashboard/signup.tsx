import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const SignUp: NextPage = () => {
  const router = useRouter();
  const { companyId } = router.query;
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [company, setCompany] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof companyId == "string") {
      setCompany(companyId);
      setHasCompany(companyId != undefined);
    }
  }, [companyId]);

  async function signUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: figure out the right way to parse a form
    const formElements = (e.target as any).elements as HTMLInputElement[];
    setLoading(true);
    setErrorText("");
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: formElements[5].value,
        email: formElements[2].value,
        firstName: formElements[0].value,
        hasCompany: hasCompany,
        lastName: formElements[1].value,
      }),
    }).then((res) => {
      if (res.status != 200) {
        setErrorText(
          res.status == 409 ? "User already exists" : res.statusText
        );
      } else {
        signIn("email", {
          redirect: false,
          email: formElements[2].value,
          callbackUrl: "/dashboard",
        });
        setSuccess(true);
        document.getElementById("success-modal")?.click();
      }
    });
    setLoading(false);
  }

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Account</title>
        <meta name="account" content="Manage your account" />
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
        <h1 className="text-3xl text-white font-bold mb-4">Sign Up</h1>
        <form className="bg-re-gray-500 rounded-xl p-6 w-96" onSubmit={signUp}>
          <div className="flex">
            <input
              required
              disabled={success}
              type="text"
              placeholder="First Name"
              className="input input-bordered w-full max-w-xs my-2.5"
            />
            <div className="mx-2" />
            <input
              required
              disabled={success}
              type="text"
              placeholder="Last Name"
              className="input input-bordered w-full max-w-xs my-2.5"
            />
          </div>
          <input
            required
            disabled={success}
            type="text"
            placeholder="Email"
            className="input input-bordered w-full max-w-xs my-2.5"
          />
          <div className="flex my-2.5">
            <div className="w-3/5 text-md">
              Is your company already signed up?
            </div>
            <div className="btn-group">
              <button
                type="button"
                disabled={success}
                className={`btn ${hasCompany ? "btn-accent" : ""}`}
                onClick={() => setHasCompany(true)}
              >
                Yes
              </button>
              <button
                type="button"
                disabled={success}
                className={`btn ${hasCompany ? "" : "btn-accent"}`}
                onClick={() => setHasCompany(false)}
              >
                No
              </button>
            </div>
          </div>
          {hasCompany && (
            <input
              required
              disabled={success}
              type="text"
              placeholder="Company ID"
              className="input input-bordered w-full max-w-xs my-2.5"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          )}
          {!hasCompany && (
            <input
              required
              disabled={success}
              type="text"
              placeholder="Company Name"
              className="input input-bordered w-full max-w-xs my-2.5"
            />
          )}
          <button
            type="submit"
            disabled={success}
            className={`btn w-full mt-4 btn-accent ${loading ? "loading" : ""}`}
          >
            Sign Up
          </button>
        </form>
        <div className="text-error mt-2">{errorText}</div>
      </main>
    </div>
  );
};

export default SignUp;
