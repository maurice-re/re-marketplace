import { Sku } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import create from "zustand";
import { LocationWithOneItem } from "../../utils/dashboard/dashboardUtils";
import { getPriceFromTable } from "../../utils/prisma/dbUtils";

interface StoreCart {
  orderString: string;
  addToCart: (locationId: string, skuQuantity: string) => void;
  removeFromCart: (locationId: string, skuQuantity: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<StoreCart>((set) => ({
  orderString: "",
  addToCart: (locationId, skuQuantity) =>
    set((state) => {
      if (state.orderString.includes(locationId)) {
        const orderStringSeparated = state.orderString.split("*");
        const orderForLocation = orderStringSeparated.find(
          (order) =>
            order.includes(locationId) &&
            order.includes(skuQuantity.split("~")[0])
        );
        if (!orderForLocation) {
          return {
            orderString: state.orderString.replace(
              locationId,
              `${locationId}_${skuQuantity}`
            ),
          };
        } else {
          const orderForLocationSeparated = orderForLocation.split("_");
          const newOrderForLocation = orderForLocationSeparated
            .map((order) => {
              if (order.includes(skuQuantity.split("~")[0])) {
                return skuQuantity;
              }
              return order;
            })
            .join("_");
          return {
            orderString: state.orderString.replace(
              orderForLocation,
              newOrderForLocation
            ),
          };
        }
      } else {
        if (state.orderString === "") {
          return { orderString: `${locationId}_${skuQuantity}` };
        } else {
          return {
            orderString:
              state.orderString + "*" + `${locationId}_${skuQuantity}`,
          };
        }
      }
    }),
  removeFromCart: (locationId, skuQuantity) =>
    set((state) => {
      if (!state.orderString.includes(locationId)) {
        return { orderString: state.orderString };
      }
      const orderStringSeparated = state.orderString.split("*");
      const orderForLocation = orderStringSeparated.find(
        (order) => order.includes(locationId) && order.includes(skuQuantity)
      );
      if (!orderForLocation) {
        return { orderString: state.orderString };
      }

      if (orderForLocation.split("_").length > 2) {
        const newOrderForLocation = orderForLocation.replace(skuQuantity, "");
        return {
          orderString: state.orderString.replace(
            orderForLocation,
            newOrderForLocation
          ),
        };
      } else {
        return { orderString: state.orderString.replace(orderForLocation, "") };
      }
    }),
  clearCart: () => set((state) => ({ orderString: "" })),
}));

function Cart({
  companyId,
  locations,
  skus,
}: {
  companyId: string;
  locations: LocationWithOneItem[];
  skus: Sku[];
}) {
  const orderString = useCartStore((state) => state.orderString);
  const clearCart = useCartStore((state) => state.clearCart);
  return (
    <div className="flex border-l border-l-re-gray-500 mb-2">
      <div className="w-56 flex flex-col text-white px-2 py-6">
        <h1 className="text-white font-theinhardt text-2xl text-center">
          Your Cart
        </h1>
        {orderString == "" && (
          <div className="text-center text-white font-theinhardt text-xl py-10">
            Your cart is empty
          </div>
        )}
        {orderString != "" &&
          orderString.split("*").map((orderForLocation, index) => {
            const orderForLocationSplit = orderForLocation.split("_");
            const locationId = orderForLocationSplit[0];
            const location = locations.find(
              (location) => location.id == locationId
            );

            return (
              <div
                className={`flex flex-col ${
                  index == 0 ? "pt-10 pb-3" : "py-3"
                }`}
                key={locationId}
              >
                <div>{location?.displayName ?? location?.city}</div>
                {orderForLocationSplit.slice(1).map((skuQuantity) => {
                  const [skuId, quantity] = skuQuantity.split("~");
                  const sku = skus.find((sku) => sku.id == skuId)!;
                  return (
                    <div
                      className="flex px-2 items-center justify-between my-2"
                      key={locationId + skuId}
                    >
                      <Image
                        src={sku?.mainImage ?? ""}
                        alt={sku?.id}
                        height={72}
                        width={72}
                        className="rounded"
                      />
                      <div className="flex flex-col justify-center text-center">
                        <div>{sku.size + " | " + sku.materialShort}</div>
                        <div>{"Qty " + quantity}</div>
                      </div>
                      <div>
                        {"$" + getPriceFromTable(sku.priceTable, quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        <button
          className="btn btn-sm btn-outline btn-error mb-3"
          onClick={clearCart}
        >
          Clear Cart
        </button>
        <Link
          href={{
            pathname: "/dashboard/checkout",
            query: {
              orderString: orderString,
              companyId: companyId,
            },
          }}
          as={`/dashboard/checkout/${new Date().getTime()}`}
        >
          <button
            className="btn btn-sm btn-outline btn-accent"
            disabled={orderString == ""}
          >
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
