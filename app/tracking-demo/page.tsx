import { Company, Event, Settings, User } from "@prisma/client";
import Link from "next/link";
import prisma from "../../constants/prisma";
import { LocationSettings, UserCompany } from "../../utils/dashboard/dashboardUtils";
import Tracking from "../dashboard/tracking/tracking";

async function getSkus() {
  const skus = await prisma.sku.findMany();
  return JSON.parse(JSON.stringify(skus));
}

async function getUser() {
  const user = await prisma.user.findUnique({
    where: {
      email: "lewis@example.com", // Complete
    },
    include: {
      company: true,
    },
  });
  return JSON.parse(JSON.stringify(user));
}

export default async function Page() {
  const user: UserCompany = await getUser();
  if (!user) return <div>Not found</div>;
  const skus = await getSkus();

  // TODO(Suhana): URGENT - Implement location selection after switch to location-based, and get location/events from that
  const events: Event[] = await prisma.event.findMany({
    where: { companyId: user.companyId },
  });
  const location: LocationSettings | null = await prisma.location.findUnique({
    where: {
      id: "219"
    },
    include: {
      settings: true,
    }
  });

  return (
    <div className="w-full h-screen bg-re-black flex overflow-auto">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Link href={"/dashboard"}>
          <button className="w-full mb-8 flex items-center justify-start gap-2">
            <svg
              width="7"
              height="15"
              viewBox="0 0 7 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.4637 2.4593L2.923 9L9.4637 15.5408C9.5126 15.5896 9.5553 15.6422 9.5919 15.6976C9.8482 16.0858 9.8054 16.6133 9.4637 16.955C9.0732 17.3455 8.4401 17.3455 8.0495 16.955L0.801679 9.7071C0.614149 9.5196 0.508789 9.2653 0.508789 9C0.508789 8.7348 0.614149 8.4805 0.801679 8.2929L8.0495 1.04509C8.4401 0.654567 9.0732 0.654567 9.4637 1.04509C9.8543 1.43561 9.8543 2.06878 9.4637 2.4593Z"
                fill="#58FEC4"
              />
            </svg>
            <h2 className="active:opacity-80 text-white font-theinhardt-300 text-md">
              Back to dashboard
            </h2>
          </button>
        </Link>
        <div className="w-full flex justify-between">
          <h3 className="w-7/8 font-theinhardt-300 text-white text-xl">
            Unlock tracking insights like these and more metric customization
            options by integrating with our tracking API.
          </h3>
          <Link href={"/trackingDemo"}>
            <button className="w-1/8 mb-8 flex items-center justify-start gap-2">
              <h2 className="active:opacity-80 decoration-re-green-300 decoration-1 underline underline-offset-2 text-white font-theinhardt-300 text-xl">
                Set up tracking
              </h2>
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.045 2.4593L16.5858 8H1C0.44771 8 0 8.4478 0 9C0 9.5523 0.44771 10 1 10H16.5858L11.045 15.5408C10.6545 15.9313 10.6545 16.5645 11.045 16.955C11.4356 17.3455 12.0687 17.3455 12.4592 16.955L19.7071 9.7072C20.0976 9.3166 20.0976 8.6835 19.7071 8.2929L12.4592 1.04509C12.2633 0.849151 12.0063 0.751521 11.7495 0.752201C11.6864 0.752371 11.6233 0.758471 11.5611 0.770501C11.372 0.807111 11.1915 0.898641 11.045 1.04509C10.6545 1.43561 10.6545 2.06878 11.045 2.4593Z"
                  fill="white"
                />
              </svg>
            </button>
          </Link>
        </div>
        <Tracking user={user} skus={skus} demo={true} events={events} location={location ?? {} as LocationSettings} />
      </main>
    </div>
  );
}
