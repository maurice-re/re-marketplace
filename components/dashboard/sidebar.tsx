import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { TbCurrentLocation } from "react-icons/tb";
type Route = {
  icon: JSX.Element;
  link: string;
  title: string;
};

function Sidebar({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<boolean>(false);
  const router = useRouter();

  function isActivePage(route: string): boolean {
    return router.pathname == route;
  }

  const routes: Route[] = [
    {
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
            d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
          />
        </svg>
      ),
      link: "/dashboard/lifecycle",
      title: "Life Cycle",
    },
    {
      icon: <TbCurrentLocation size={20} />,
      link: "/dashboard/tracking",
      title: "Tracking",
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
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/dashboard/store",
      title: "Shop",
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
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      link: "/dashboard/account",
      title: "Account",
    },
  ];

  if (!opened) {
    return (
      <div className="flex h-screen">
        <div className="w-20 bg-black flex flex-col items-center text-white">
          <button
            className="rounded py-2 hover:text-re-green-800"
            onClick={() => setOpened(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
          {routes.map((route) => (
            <Link
              key={route.link}
              href={{
                pathname: route.link,
              }}
            >
              <button
                className={`${
                  isActivePage(route.link) ? "bg-re-green-700" : ""
                } hover:bg-re-green-600 active:bg-re-green-500 flex justify-center items-center py-3 px-3 rounded-10 my-1`}
              >
                {route.icon}
              </button>
            </Link>
          ))}
        </div>
        {children}
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <div className="w-48 bg-black flex flex-col text-white">
        <button
          className="rounded py-2 hover:text-re-green-800 mr-2 self-center"
          onClick={() => setOpened(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
        {routes.map((route) => (
          <Link
            key={route.link}
            href={{
              pathname: route.link,
            }}
          >
            <button
              className={`${
                isActivePage(route.link) ? "bg-re-green-700" : ""
              } hover:bg-re-green-600 active:bg-re-green-500 flex justify-center items-center py-1 mr-2 rounded-lg`}
            >
              {route.icon}
              <div className=" font-theinhardt text-xl py-2 ml-2">
                {route.title}
              </div>
            </button>
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}

export default Sidebar;
