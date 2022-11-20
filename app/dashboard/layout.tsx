import { Order, Status, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 8.25V6.75C7.5 5.55653 7.97411 4.41193 8.81802 3.56802C9.66193 2.72411 10.8065 2.25 12 2.25V2.25C13.1935 2.25 14.3381 2.72411 15.182 3.56802C16.0259 4.41193 16.5 5.55653 16.5 6.75V8.25M3.75 8.25C3.55109 8.25 3.36032 8.32902 3.21967 8.46967C3.07902 8.61032 3 8.80109 3 9V19.125C3 20.5425 4.2075 21.75 5.625 21.75H18.375C19.7925 21.75 21 20.6011 21 19.1836V9C21 8.80109 20.921 8.61032 20.7803 8.46967C20.6397 8.32902 20.4489 8.25 20.25 8.25H3.75Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.5 10.5V11.25C7.5 12.4435 7.97411 13.5881 8.81802 14.432C9.66193 15.2759 10.8065 15.75 12 15.75C13.1935 15.75 14.3381 15.2759 15.182 14.432C16.0259 13.5881 16.5 12.4435 16.5 11.25V10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      ),
      link: "/dashboard/store",
      title: "Shop",
    },
  ];

  if (hasCompleteOrder) {
    routes.splice(0, 0,
      {
        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.75 9.9375V21C3.75 21.1989 3.82902 21.3897 3.96967 21.5303C4.11032 21.671 4.30109 21.75 4.5 21.75H9V15.375C9 15.0766 9.11853 14.7905 9.3295 14.5795C9.54048 14.3685 9.82663 14.25 10.125 14.25H13.875C14.1734 14.25 14.4595 14.3685 14.6705 14.5795C14.8815 14.7905 15 15.0766 15 15.375V21.75H19.5C19.6989 21.75 19.8897 21.671 20.0303 21.5303C20.171 21.3897 20.25 21.1989 20.25 21V9.9375" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M22.5 12L12.5105 2.43747C12.2761 2.18997 11.7281 2.18716 11.4895 2.43747L1.5 12M18.75 8.3906V2.99997H16.5V6.23435" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        ),
        link: "/dashboard",
        title: "Home",
      },
      {
        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16.0017V7.99733C20.9997 7.73534 20.9308 7.47801 20.8001 7.25095C20.6694 7.02388 20.4815 6.835 20.2552 6.70311L13.1302 2.55655C12.7869 2.35669 12.3968 2.2514 11.9995 2.2514C11.6023 2.2514 11.2122 2.35669 10.8689 2.55655L3.74484 6.70311C3.51848 6.835 3.33061 7.02388 3.19993 7.25095C3.06925 7.47801 3.00032 7.73534 3 7.99733V16.0017C3.00016 16.2638 3.06901 16.5214 3.1997 16.7486C3.33038 16.9759 3.51834 17.1649 3.74484 17.2969L10.8698 21.4434C11.2132 21.643 11.6033 21.7481 12.0005 21.7481C12.3976 21.7481 12.7877 21.643 13.1311 21.4434L20.2561 17.2969C20.4824 17.1648 20.6702 16.9757 20.8007 16.7485C20.9312 16.5212 20.9999 16.2638 21 16.0017Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3.23438 7.21826L12 12.3745L20.7656 7.21826M12 21.7495V12.3745" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>),
        link: "/dashboard/orderItem",
        title: "Orders",
      },
      {
        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.25C8.27344 2.25 5.25 5.12766 5.25 8.67188C5.25 12.75 9.75 19.2127 11.4023 21.4448C11.4709 21.5391 11.5608 21.6157 11.6647 21.6686C11.7686 21.7215 11.8835 21.749 12 21.749C12.1165 21.749 12.2314 21.7215 12.3353 21.6686C12.4392 21.6157 12.5291 21.5391 12.5977 21.4448C14.25 19.2136 18.75 12.7533 18.75 8.67188C18.75 5.12766 15.7266 2.25 12 2.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        ),
        link: "/dashboard/location",
        title: "Locations",
      },
      {
        icon: (<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="20" height="20" viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>),
        link: "/dashboard/lifecycle",
        title: "Lifecycle",
      },
      {
        icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5V2.625M12 21.375V19.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 5.25C10.665 5.25 9.35994 5.64588 8.2499 6.38758C7.13987 7.12928 6.27471 8.18349 5.76382 9.41689C5.25292 10.6503 5.11925 12.0075 5.3797 13.3169C5.64015 14.6262 6.28303 15.829 7.22703 16.773C8.17104 17.717 9.37377 18.3599 10.6831 18.6203C11.9925 18.8808 13.3497 18.7471 14.5831 18.2362C15.8165 17.7253 16.8707 16.8601 17.6124 15.7501C18.3541 14.6401 18.75 13.335 18.75 12C18.75 10.2098 18.0388 8.4929 16.773 7.22703C15.5071 5.96116 13.7902 5.25 12 5.25Z" stroke="white" stroke-miterlimit="10" />
          <path d="M19.5 12H21.375M2.625 12H4.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        ),
        link: "/dashboard/tracking",
        title: "Tracking",
      }
    );
    routes.splice(6, 0, {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.125 6.75C15.9412 9.22828 14.0625 11.25 12 11.25C9.93748 11.25 8.05545 9.22875 7.87498 6.75C7.68748 4.17188 9.5156 2.25 12 2.25C14.4844 2.25 16.3125 4.21875 16.125 6.75Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 14.25C7.92187 14.25 3.7828 16.5 3.01687 20.7469C2.92452 21.2588 3.21421 21.75 3.74999 21.75H20.25C20.7862 21.75 21.0759 21.2588 20.9836 20.7469C20.2172 16.5 16.0781 14.25 12 14.25Z" stroke="white" stroke-miterlimit="10" />
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
          <div className="w-1/8 mx-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3636 3C8.90722 3 7.48354 3.43187 6.2726 4.24099C5.06167 5.05011 4.11786 6.20015 3.56052 7.54567C3.00319 8.89119 2.85737 10.3718 3.14149 11.8002C3.42562 13.2286 4.12693 14.5406 5.15675 15.5704C6.18657 16.6003 7.49863 17.3016 8.92703 17.5857C10.3554 17.8698 11.836 17.724 13.1815 17.1667C14.527 16.6093 15.6771 15.6655 16.4862 14.4546C17.2953 13.2437 17.7272 11.82 17.7272 10.3636C17.7271 8.41069 16.9512 6.5378 15.5703 5.15688C14.1894 3.77597 12.3165 3.00012 10.3636 3V3Z" stroke="white" stroke-miterlimit="10" />
            <path d="M15.8574 15.8574L21 21" stroke="white" stroke-miterlimit="10" stroke-linecap="round" />
          </svg>
          </div>
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
