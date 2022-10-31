import { Sku } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../stores/cartStore";
import { LocationWithOneItem } from "../../utils/dashboard/dashboardUtils";
import { getPriceFromTable } from "../../utils/prisma/dbUtils";

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
            pathname: "/checkout",
            query: {
              orderString: orderString,
              companyId: companyId,
            },
          }}
          as={`/checkout/${new Date().getTime()}`}
        >
          <button
            className="btn btn-sm btn-outline btn-accent w-full"
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
