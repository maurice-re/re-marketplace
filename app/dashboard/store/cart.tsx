import { Sku } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../../stores/cartStore";
import { LocationWithOneItem } from "../../../utils/dashboard/dashboardUtils";
import { getPriceFromTable } from "../../../utils/prisma/dbUtils";

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
    // <div className="flex">
    <div className="w-70 flex flex-col text-white justify-between h-screen  border-l border-l-re-gray-500">
      <div className="flex justify-between py-4 pl-6 text-white border-b-1/2 border-re-dark-green-100">
        <h1 className="font-theinhardt text-lg">Shopping Cart</h1>
      </div>
      {orderString == "" && (
        <div className="flex items-center flex-col 4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 20.25C8.66421 20.25 9 19.9142 9 19.5C9 19.0858 8.66421 18.75 8.25 18.75C7.83579 18.75 7.5 19.0858 7.5 19.5C7.5 19.9142 7.83579 20.25 8.25 20.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18.75 20.25C19.1642 20.25 19.5 19.9142 19.5 19.5C19.5 19.0858 19.1642 18.75 18.75 18.75C18.3358 18.75 18 19.0858 18 19.5C18 19.9142 18.3358 20.25 18.75 20.25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.25 3.75H5.25L7.5 16.5H19.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.5 13.5H19.1925C19.2792 13.5001 19.3633 13.4701 19.4304 13.4151C19.4975 13.3601 19.5434 13.2836 19.5605 13.1986L20.9105 6.44859C20.9214 6.39417 20.92 6.338 20.9066 6.28414C20.8931 6.23029 20.8679 6.18009 20.8327 6.13717C20.7975 6.09426 20.7532 6.05969 20.703 6.03597C20.6528 6.01225 20.598 5.99996 20.5425 6H6" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div className="text-center text-white font-theinhardt text-lg py-4">
            Your cart is empty
          </div>

        </div>)}
      {orderString != "" &&
        orderString.split("*").map((orderForLocation, index) => {
          const orderForLocationSplit = orderForLocation.split("_");
          const locationId = orderForLocationSplit[0];
          const location = locations.find(
            (location) => location.id == locationId
          );

          return (
            <div
              className={`flex flex-col ${index == 0 ? "pt-10 pb-3" : "py-3"
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
      {/* <button
            className="btn btn-sm btn-outline btn-error"
            onClick={clearCart}
          >
            Clear Cart
          </button> */}
      <div className="font-theinhardt-300 text-lg flex items-center justify-center w-full flex-col border-t-1/2 border-re-dark-green-100 py-4 px-6">
        <div className="flex items-center w-full justify-between mb-2">
          <h2 className="font-theinhardt-300 text-left text-white">Subtotal</h2>
          <h2 className="text-left text-white">$0.00</h2>
        </div>
        <h2 className="text-re-dark-green-100 text-sm leading-none mb-8 w-full">Shipping and taxes calculated at checkout.</h2>
        <Link
          className={`w-full ${orderString == "" && "pointer-events-none"
            }`}
          href={{
            pathname: "/checkout",
            query: {
              orderString: orderString,
            },
          }}
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
    // </div>
  );
}

export default Cart;
