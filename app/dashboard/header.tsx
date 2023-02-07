"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { Route } from "./layout";

export default function Header({ routes }: { routes: Route[]; }) {
  const pathname = usePathname();
  let title = routes.find((route) => route.link == pathname)?.title;
  if (pathname?.startsWith("/dashboard/order/")) {
    title = "Order";
  }
  return (
    <div className="flex flex-col">
      <div className="flex justify-end pr-4 py-1 text-xl">
        <BiLogOut
          className="cursor-pointer text-white hover:text-re-gray-text"
          onClick={() => signOut()}
        />
      </div>
      <div className="flex py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
        <h1 className="font-theinhardt text-lg">{title}</h1>
      </div>
    </div>
  );
}
