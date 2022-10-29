"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function SidebarIcon({
  icon,
  link,
  title,
}: {
  icon: JSX.Element;
  link: string;
  title: string;
}) {
  const segment = useSelectedLayoutSegment();
  console.log(segment);
  console.log(link);

  return (
    <Link
      key={link}
      href={{
        pathname: link,
      }}
    >
      <button
        className={`${
          `/dashboard/${segment}` == link ? "bg-re-green-700" : ""
        } hover:bg-re-green-600 active:bg-re-green-500 flex justify-center items-center py-3 px-3 rounded-10 my-1`}
      >
        {icon}
      </button>
    </Link>
  );
}
