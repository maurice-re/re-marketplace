import { useServerStore } from "../../server-store";
import Locations from "./locations";

export default async function Page() {
  const user = await useServerStore.getState().getUser();
  const company = await useServerStore.getState().getCompany();
  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Locations user={user} company={company} ownedLocations={ownedLocations} viewableLocations={viewableLocations} />
      </main>
    </div>
  );
}
