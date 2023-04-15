import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";

import { Company, User } from "@prisma/client";
import { FullOrder } from "../../server-store";
import LatestOrder from "./latestOrder";
import OrderTracking from "./orderTracking";

function Home({
  company,
  orders,
  user,
  skus,
}: {
  company: Company;
  orders: FullOrder[];
  user: User;
  skus: SkuProduct[];
}) {
  return (
    <div className="flex flex-col overflow-auto">
      <h1 className="border-b-1/2 border-re-gray-300 bg-re-black py-2 pl-6 text-lg text-white">
        {/* TODO: USER Company */}
        Welcome {user.firstName} – {company.name}
      </h1>
      <main className="flex flex-col text-white font-theinhardt bg-re-dark-green-500 h-screen overflow-auto">
        <div className="flex items-center justify-center p-4">
          <div className="flex flex-col w-3/5 justify-between gap-6">
            <OrderTracking orders={orders} skus={skus} />
            <LatestOrder orders={orders} skus={skus} />
          </div>
        </div>
      </main>
    </div>
  );
}
export default Home;
