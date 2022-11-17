import { Order, Status, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import { GoSearch } from "react-icons/go";
import { TbCurrentLocation } from "react-icons/tb";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import SidebarIcon from "./sidebarIcon";

type Route = {
  icon: JSX.Element;
  link: string;
  title: string;
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const setUser = useAuthStore((state) => state.setUser);

  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    return <div>Not logged in</div>;
  }
  const user = session.user as User;
  // setUser(user);

  const completedOrders: Order[] = await prisma.order.findMany({
    where: {
      companyId: user.companyId,
      status: Status.COMPLETED,
    },
  });

  const incompleteOrders: Order[] = await prisma.order.findMany({
    where: {
      companyId: user.companyId,
      NOT: {
        status: Status.COMPLETED,
      }
    },
  });

  // Need to be test user or have at least one complete order
  const hasCompleteOrder: boolean =
    completedOrders.length > 0 || user.companyId === "616";

  const hasIncompleteOrder: boolean =
    incompleteOrders.length > 0;

  // All users see the following
  const routes: Route[] = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/dashboard/store",
      title: "Shop",
    },
  ];

  if (hasCompleteOrder) {
    routes.splice(0, 0, {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      link: "/dashboard",
      title: "Home",
    },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        ),
        link: "/dashboard/orderItem",
        title: "Orders",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        ),
        link: "/dashboard/location",
        title: "Locations",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        ),
        link: "/dashboard/lifecycle",
        title: "Lifecycle",
      },
      {
        icon: <TbCurrentLocation size={20} />,
        link: "/dashboard/tracking",
        title: "Tracking",
      }
    );
    routes.splice(6, 0, {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/dashboard/account",
      title: "Account",
    });
  } else if (hasIncompleteOrder) {
    routes.splice(0, 0, {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      link: "/dashboard",
      title: "Home",
    }
    );
    routes.splice(2, 0, {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/dashboard/account",
      title: "Account",
    });
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="flex flex-col items-center text-white px-8 mr-6 border-r-1/2 border-re-dark-green-100">
        <div className="w-full flex items-center justify-center gap-20 mt-6 mb-8">
          <Image
            src={"/images/logo.png"}
            height={29}
            width={38}
            alt={"Re Company Logo"}
          />
          <div className="avatar placeholder">
            <div className="bg-re-green-500 text-black rounded-full w-8">
              <span className="text-md">
                {user.firstName?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-40 h-7 mb-6 flex items-center justify-center rounded border-1/2 border-re-dark-green-300 bg-re-dark-green-200">
          <div className="w-1/8 mx-2"><GoSearch size={15} /></div>
          <div className="w-7/8">
            <input className="w-full font-theinhardt-300  font-white focus:outline-none bg-transparent" placeholder="Search"></input>
          </div>
        </div>
        <div className="w-full">
          {routes.map((route) => (
            <SidebarIcon
              key={route.link}
              icon={route.icon}
              link={route.link}
              title={route.title}
            />
          ))}
        </div>
      </div>
      <div id="children" className="w-full">
        {children}
      </div>
    </div>
  );
}
