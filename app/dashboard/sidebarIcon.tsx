"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarIcon({
  icon,
  link,
  title,
}: {
  icon: JSX.Element;
  link: string;
  title: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      key={link}
      href={{
        pathname: link,
      }}
    >
      <button className={`${pathname == link ? "bg-re-dark-green-200" : ""} rounded w-full flex items-center justify-start h-7 mb-2`}>

        <div
          className="flex justify-center items-center py-3 pl-2 pr-3 rounded-10 my-1"
        >
          {icon}
        </div>
        <p className="font-theinhardt-300">{title}</p>
      </button>
    </Link>
  );
}
