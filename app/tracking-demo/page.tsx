import Link from "next/link";
import Tracking from "../dashboard/tracking/tracking";
import { useServerStore } from "../server-store";

export default async function Page() {
  const demoLocation = await useServerStore.getState().getLocationById("13");
  // Set demoLocations most recent event as today and change all other events to corresponding days
  const today = new Date();
  const mostRecentEvent = demoLocation.events.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  })[0];
  console.log(mostRecentEvent);
  const mostRecentEventDate = new Date(mostRecentEvent.timestamp);
  const daysSinceMostRecentEvent =
    today.getTime() - mostRecentEventDate.getTime();
  demoLocation.events = demoLocation.events.map((event) => {
    const eventDate = new Date(event.timestamp).getTime();
    return {
      ...event,
      timestamp: new Date(eventDate + daysSinceMostRecentEvent),
    };
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
          <Link href={"/dashboard/tracking"}>
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
        <Tracking
          settings={demoLocation.settings}
          events={JSON.parse(JSON.stringify(demoLocation.events))}
        />
      </main>
    </div>
  );
}
