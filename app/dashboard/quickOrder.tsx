"use client";
import { Location } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { skuName } from "../../utils/dashboard/dashboardUtils";
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../utils/prisma/dbUtils";
import { SkuWithProduct } from "../server-store";

function QuickOrder({
  companyId,
  locations,
  skus,
}: {
  companyId: string;
  customerId: string;
  locations: Location[];
  userId: string;
  skus: SkuWithProduct[];
}) {
  const [selected, setSelected] = useState<SkuWithProduct[]>([]);
  const [skuIdQuantity, setSkuIdQuantity] = useState<
    [SkuWithProduct, string][]
  >([]);
  const [location, setLocation] = useState<string>(
    locations.length > 1 ? locations[0].id : "new"
  );

  function handleItemPress(skuSelected: SkuWithProduct) {
    const isSelected = selected.find((s) => s.id == skuSelected.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((s) => s.id != skuSelected.id));
      setSkuIdQuantity((prev) => prev.filter((s) => s[0].id != skuSelected.id));
    } else {
      setSelected((prev) => [...prev, skuSelected]);
      setSkuIdQuantity((prev) => [...prev, [skuSelected, "0"]]);
    }
  }

  function getQuantityOfSku(skuId: string): string {
    const tuple = skuIdQuantity.find((tup) => tup[0].id == skuId);
    if (tuple) {
      return tuple[1] == "0" || tuple[1] == "" ? "1" : tuple[1];
    }
    return "1";
  }

  function handleQuantityChange(val: string, skuSelected: SkuWithProduct) {
    setSkuIdQuantity((prev) => {
      return prev.map((tup) => {
        if (tup[0].id == skuSelected.id) {
          tup[1] = val;
        }
        return tup;
      });
    });
  }

  function createOrderString(): string {
    const orderString = location == "New Location" ? "new" : location;
    return skuIdQuantity.reduce((orders, tuple) => {
      const [sku, quantity] = tuple;
      return orders + "_" + [sku.id, quantity].join("~");
    }, orderString);
  }

  return (
    <div className="flex flex-col bg-re-dark-green-300 border border-re-gray-300 rounded-md items-start">
      <h1 className=" font-theinhardt text-2xl p-4">Quick Order</h1>
      <div className="h-px bg-re-gray-300 mb-4 w-full" />
      <div className="flex justify-between w-full gap-4 p-4">
        <div
          className={`grid gap-2 h-96 overflow-y-auto w-full pr-1 items-start ${selected.length == 0
            ? "2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 grid-cols-4"
            : "2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2"
            }`}
        >
          {skus
            .filter((s) => s.product.active)
            .map((sku) => (
              <div
                key={sku.id}
                className="flex flex-col items-center mx-1 mb-2 group"
              >
                <button
                  className={`rounded w-24 h-24 group-hover:border-re-green-500 group-hover:border-2 group-active:border-re-green-700 border-white ${selected.includes(sku)
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
          <div className="flex flex-col justify-start min-w-[11rem]">
            {selected.map((sku) => (
              <div
                className="flex justify-between items-center mb-4"
                key={sku.id}
              >
                <div className="flex-col">
                  <div className="">{sku.product.name}</div>
                  <div className="text-xs">
                    {sku.size + " | " + sku.materialShort}
                  </div>
                </div>
                <div className="text-sm font-theinhardt text-center">
                  {`$${getPriceFromTable(
                    sku.priceTable,
                    getQuantityOfSku(sku.id)
                  )}`}
                </div>
                <input
                  value={skuIdQuantity.find(([s]) => s.id == sku.id)?.[1] ?? ""}
                  onChange={(e) => handleQuantityChange(e.target.value, sku)}
                  className="bg-re-black rounded py-1 bg-opacity-40 px-2 w-11 text-xs text-center flex min-w-[3.5rem]"
                />
              </div>
            ))}
            <div className="h-px mb-3 bg-re-gray-300 bg-opacity-70" />
            <div className="flex justify-between mb-2">
              <div>Total:</div>
              <div>
                {`$${skuIdQuantity
                  .reduce(
                    (prev, [sku, quantity]) =>
                      calculatePriceFromCatalog(
                        sku,
                        sku.id,
                        quantity == "" ? 0 : quantity
                      ) + prev,
                    0
                  )
                  .toFixed(2)}`}
              </div>
            </div>
            <div className="flex justify-between mb-4 items-center">
              <div>Location:</div>
              <select
                className="bg-re-black bg-opacity-40 text-sm py-2 px-px rounded enabled:border-black ml-2"
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
                pathname: "/checkout",
                query: {
                  orderString: createOrderString(),
                  companyId: companyId,
                },
              }}
            // as={`/checkout/${new Date().getTime()}`}
            >
              <button className="px-3 py-2 bg-re-purple-500 rounded hover:bg-re-purple-600 w-full">
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
