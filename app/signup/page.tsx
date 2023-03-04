import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../constants/prisma";
import SignUpForm from "./signupForm";

export default async function Page({
  searchParams,
}: {
  searchParams?: { email: string };
}) {
  if (!(searchParams && searchParams.email)) {
    return (
      <div>
        <div>Something went wrong</div>
        <div className="w-1" />
        <Link href={"/signin"}>Try Again</Link>
      </div>
    );
  }

  const users = await prisma.user.findMany({});

  const emailExists = users.find((user) => user.email == searchParams.email);
  if (emailExists) {
    redirect("/signin");
  }

  function checkMatchingEmail(a: string, b: string): boolean {
    const domain = a.split("@")[1];
    const commonEmails = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "live.com",
      "myyahoo.com",
    ];
    return !commonEmails.includes(domain) && domain === b.split("@")[1];
  }

  const admin = users.find((user) =>
    checkMatchingEmail(searchParams.email, user.email)
  );

  return (
    <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
      <SignUpForm email={searchParams.email} admin={admin} />
    </div>
  );
}
