"use client";

import { usePathname } from "next/navigation";
import { Route } from "./layout";

export default function Header({ routes }: { routes: Route[] }) {
  const pathname = usePathname();
  let title = routes.find((route) => route.link == pathname)?.title;
  console.log(pathname);
  if (pathname?.startsWith("/dashboard/order/")) {
    title = "Order";
  }
  return (
    // <div className="w-full">
    //     <div className="h-screen bg-re-black flex">
    //         <main className="flex flex-col w-full h-full overflow-y-auto font-theinhardt min-h-screen max-h-screen">
    <div className="flex mt-4 py-4 pl-6 text-white border-y-1/2 border-re-gray-300">
      <h1 className="font-theinhardt text-lg">{title}</h1>
    </div>
    //         </main>
    //     </div>
    // </div>
  );
}
