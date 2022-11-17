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
      <button
        className={`${pathname == link ? "bg-re-green-700" : ""
          } hover:bg-re-green-600 active:bg-re-green-500 flex justify-center items-center py-3 px-3 rounded-10 my-1`}
      >
        {icon}
      </button>
    </Link>
  );
}
