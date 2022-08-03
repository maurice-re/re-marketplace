import { Location, Status } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  skuName,
  SkuProduct,
  totalFromOrders,
  TransactionCustomerOrders,
} from "../../utils/dashboard/dashboardUtils";

function QuickOrder({
  customerId,
  locations,
  userId,
  skus,
}: {
  customerId: string;
  locations: Location[];
  userId: string;
  skus: SkuProduct[];
}) {
  const [selected, setSelected] = useState<SkuProduct[]>([]);
  const [skuIdQuantity, setSkuIdQuantity] = useState<[SkuProduct, string][]>(
    []
  );
  const [location, setLocation] = useState<string>(locations[0].id);
  const router = useRouter();

  function handleItemPress(skuSelected: SkuProduct) {
    const isSelected = selected.find((s) => s.id == skuSelected.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((s) => s.id != skuSelected.id));
      setSkuIdQuantity((prev) => prev.filter((s) => s[0].id != skuSelected.id));
    } else {
      setSelected((prev) => [...prev, skuSelected]);
      setSkuIdQuantity((prev) => [...prev, [skuSelected, "0"]]);
    }
  }

  function handleQuantityChange(val: string, skuSelected: SkuProduct) {
    setSkuIdQuantity((prev) => {
      return prev.map((tup) => {
        if (tup[0].id == skuSelected.id) {
          tup[1] = val;
        }
        return tup;
      });
    });
  }

  function handleBuyNow(): string {
    const now = new Date();
    const selectedLocation = locations.find((loc) => loc.id == location);

    if (selectedLocation) {
      const orders = skuIdQuantity.map(([sku, quantity]) => {
        return {
          id: "",
          amount: sku.price * parseInt(quantity),
          company: {
            customerId: customerId,
          },
          companyId: selectedLocation.companyId,
          createdAt: now,
          location: selectedLocation,
          locationId: selectedLocation.id,
          quantity: parseInt(quantity),
          shippedAt: now,
          recievedAt: now,
          status: Status.PROCESSING,
          skuId: sku.id,
          sku: sku,
          transactionId: "",
          userId: userId,
        };
      });

      const transaction: TransactionCustomerOrders = {
        id: "",
        amount: totalFromOrders(orders),
        company: {
          customerId: customerId,
        },
        companyId: selectedLocation.companyId,
        createdAt: now,
        numItems: 0,
        numLocations: 0,
        orders: orders,
        status: Status.PROCESSING,
        userId: userId,
      };
      return JSON.stringify(transaction);
    }

    return "";
  }

  return (
    <div className="flex flex-col mx-1 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
      <h1 className=" text-re-green-500 font-theinhardt text-2xl mb-2">
        Quick Order
      </h1>
      <div className=" h-px bg-white mb-4 w-full" />
      <div className="flex justify-between w-full">
        <div
          className={`flex flex-wrap ${
            selected.length == 0 ? "w-full" : "W-2/3"
          }`}
        >
          {skus.map((sku) => (
            <div
              key={sku.id}
              className=" flex flex-col items-center mx-1 mb-2 group"
            >
              <button
                className={`rounded w-24 h-24 group-hover:border-re-green-500 group-hover:border-2 group-active:border-re-green-700 border-white ${
                  selected.includes(sku)
                    ? "border-re-green-600 border-3"
                    : "border"
                }`}
                onClick={() => handleItemPress(sku)}
              >
                <Image
                  src={sku.mainImage}
                  height={96}
                  width={96}
                  alt={skuName(sku)}
                />
              </button>
              <div className="flex text-xs text-center mt-1">
                <div>{sku.size}</div>
                <div className="w-1" />
                <div>|</div>
                <div className="w-1" />
                <div>{sku.materialShort}</div>
              </div>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex flex-col justify-center">
            {selected.map((sku) => (
              <div
                className="flex justify-between items-center mb-4"
                key={sku.id}
              >
                <div className="flex-col">
                  <div className="flex items-center">
                    <div className="font-theinhardt text-sm mr-2">
                      {sku.product.name}
                    </div>
                    <div className="font-theinhardt-300 text-xs">
                      {sku.size + " | " + sku.materialShort}
                    </div>
                  </div>
                  <div className="text-xs font-theinhardt text-center">
                    {`\$${sku.price} each`}
                  </div>
                </div>
                <input
                  value={
                    skuIdQuantity.find((tup) => tup[0].id == sku.id)?.[1] ?? ""
                  }
                  onChange={(e) => handleQuantityChange(e.target.value, sku)}
                  className="bg-re-gray-500 bg-opacity-70 w-9 text-sm"
                />
              </div>
            ))}
            <div className="h-px mx-2 mb-3 bg-white bg-opacity-70" />
            <div className="flex justify-between mb-2">
              <div>Total:</div>
              <div>
                {`\$${skuIdQuantity
                  .reduce(
                    (prev, curr) =>
                      curr[0].price * parseInt(curr[1] == "" ? "0" : curr[1]) +
                      prev,
                    0
                  )
                  .toFixed(2)}`}
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div>Location:</div>
              <select
                className="bg-re-gray-500 bg-opacity-70 text-sm rounded enabled:border-black ml-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option value={loc.id} key={loc.id}>
                    {loc.displayName ?? loc.city}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href={{
                pathname: "/dashboard/checkout",
                query: { orders: handleBuyNow() },
              }}
              as={`/dashboard/checkout/${new Date().getTime()}`}
            >
              <button
                className="px-3 py-2 bg-re-gray-400 rounded hover:bg-re-green-600 hover:text-black"
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickOrder;
