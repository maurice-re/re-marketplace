import { useServerStore } from "../../server-store";
import Locations from "./locations";

export default async function Page() {
  const user = await useServerStore.getState().getUser();
  const company = await useServerStore.getState().getCompany();
  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);
  const createdGroups = await useServerStore.getState().getGroups(true);
  const memberGroups = await useServerStore.getState().getGroups(false);

  return (
    <div className="w-full h-screen flex overflow-auto px-6">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Locations user={user} ownedLocations={ownedLocations} viewableLocations={viewableLocations} createdGroups={createdGroups} memberGroups={memberGroups} />
      </main>
    </div>
  );
}
