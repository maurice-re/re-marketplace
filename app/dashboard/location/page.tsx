import { useServerStore } from "../../server-store";
import Locations from "./locations";

export default async function Page() {
  const user = await useServerStore.getState().getUser();
  const company = await useServerStore.getState().getCompany();

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Locations user={user} company={company} />
      </main>
    </div>
  );
}
