import { useServerStore } from "../server-store";
import HardwareForm from "./hardwareForm";

export default async function Page() {
  await useServerStore.getState().getUser();
  const locations = await useServerStore.getState().getLocations(true);

  if (!locations) {
    return (
      <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
        <div className="flex">
          <h1 className="text-2xl"> You have no locations.</h1>
          <a
            href="/"
            className="text-2xl hover:underline hover:text-re-purple-500 ml-1"
          >
            Go back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
      <HardwareForm locations={locations} />
    </div>
  );
}
