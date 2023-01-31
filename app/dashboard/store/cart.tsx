import { Location, Sku } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { CartStore, useCartStore } from "../../../stores/cartStore";
import { getOrderStringTotal } from "../../../utils/dashboard/orderStringUtils";
import { getPriceFromTable } from "../../../utils/prisma/dbUtils";

function Cart({ locations, skus }: { locations: Location[]; skus: Sku[]; }) {
  const orderString = useCartStore((state: CartStore) => state.orderString);
  const clearCart = useCartStore((state: CartStore) => state.clearCart);
  return (
    <div className="w-70 lg:w-80 2xl:w-96 flex flex-col text-white justify-between border-l border-l-re-gray-500 flex-grow-0">
      <h1 className="font-theinhardt text-lg py-4 pl-6 border-b-1/2 border-re-gray-300">
        Shopping Cart
      </h1>
      {orderString != "" && (
        <div className="flex flex-col gap-4 h-96 text-white overflow-y-auto ">
          {orderString.split("*").map((orderForLocation: string) => {
            const orderForLocationSplit = orderForLocation.split("_");
            const locationId = orderForLocationSplit[0];
            const location = locations.find(
              (location) => location.id == locationId
            );
            return (
              <div
                className="flex flex-col px-6 w-full font-theinhardt-300"
                // className={`flex flex-col ${index == 0 ? "pt-10 pb-3" : "py-3"
                //   }`}
                key={locationId}
              >
                <div className="text-re-green-300">
                  {location?.displayName ?? location?.city}
                </div>
                {orderForLocationSplit.slice(1).map((skuQuantity) => {
                  const [skuId, quantity] = skuQuantity.split("~");
                  const sku = skus.find((sku) => sku.id == skuId)!;
                  return (
                    <div
                      className="flex items-center justify-between my-2"
                      key={locationId + skuId}
                    >
                      <Image
                        src={sku?.mainImage ?? ""}
                        alt={sku?.id}
                        height={72}
                        width={72}
                        className="rounded"
                      />
                      <div className="justify-between h-full w-full flex text-white ml-2">
                        <div className="w-3/4 flex flex-col justify-between h-full ">
                          <div className="flex flex-col">
                            <h2 className="text-md leading-tight">
                              {sku.materialShort}
                            </h2>
                            <h2 className="text-sm pt-1 pb-2 leading-none text-gray-300 ">
                              {sku.size +
                                " · " +
                                sku.color.charAt(0).toUpperCase() +
                                sku.color.slice(1)}
                            </h2>
                          </div>
                          <h2 className="text-md leading-tight">
                            {"Qty " + quantity}
                          </h2>
                        </div>
                        <div className="w-1/4">
                          <h2>
                            {"$" +
                              getPriceFromTable(
                                sku.priceTable,
                                quantity
                              ).toFixed(2)}
                          </h2>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      {orderString == "" && (
        <div className="flex items-center flex-col 4 my-auto">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 20.25C8.66421 20.25 9 19.9142 9 19.5C9 19.0858 8.66421 18.75 8.25 18.75C7.83579 18.75 7.5 19.0858 7.5 19.5C7.5 19.9142 7.83579 20.25 8.25 20.25Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.75 20.25C19.1642 20.25 19.5 19.9142 19.5 19.5C19.5 19.0858 19.1642 18.75 18.75 18.75C18.3358 18.75 18 19.0858 18 19.5C18 19.9142 18.3358 20.25 18.75 20.25Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25 3.75H5.25L7.5 16.5H19.5"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 13.5H19.1925C19.2792 13.5001 19.3633 13.4701 19.4304 13.4151C19.4975 13.3601 19.5434 13.2836 19.5605 13.1986L20.9105 6.44859C20.9214 6.39417 20.92 6.338 20.9066 6.28414C20.8931 6.23029 20.8679 6.18009 20.8327 6.13717C20.7975 6.09426 20.7532 6.05969 20.703 6.03597C20.6528 6.01225 20.598 5.99996 20.5425 6H6"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-center text-white font-theinhardt text-lg py-4">
            Your cart is empty
          </div>
        </div>
      )}
      <div className="w-full flex flex-col items-justify items-center gap-6">
        {orderString !== "" && (
          <div className="px-4 w-full">
            <button
              className={`border-1/2 border-re-gray-300 bg-re-gray-300 bg-opacity-70 rounded-md py-1 font-theinhardt-300 text-white text-lg w-full`}
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>
        )}
        <div className="px-6 font-theinhardt-300 text-lg flex items-center justify-center w-full flex-col border-t-1/2 border-re-gray-300 py-4 ">
          <div className="flex items-center w-full justify-between mb-1">
            <h2 className="font-theinhardt-300 text-left text-white">
              Subtotal
            </h2>
            <h2 className="text-left text-white">
              ${getOrderStringTotal(orderString, [], skus ?? []).toFixed(2)}
            </h2>
          </div>
          <h2 className="text-re-gray-300 text-sm leading-none w-full">
            Shipping and taxes calculated at checkout.
          </h2>
          <Link
            className={`w-full my-4 ${orderString == "" && "pointer-events-none"
              }`}
            href={{
              pathname: "/checkout",
              query: {
                orderString: orderString,
              },
            }}
          >
            <button
              className={`${orderString === ""
                ? "text-re-gray-300 border-1/2 border-re-gray-300"
                : "bg-re-blue-500"
                }  rounded-md py-1 font-theinhardt-300 text-white text-lg w-full`}
              disabled={orderString == ""}
            >
              Checkout
            </button>
          </Link>
          <div
            className={`${orderString === "" ? "text-re-gray-300" : "text-white"
              }  text-sm w-full flex justify-center items-center`}
          >
            <h2 className="text-center">Or,</h2>
            <Link
              className={` ${orderString == "" && "pointer-events-none"}`}
              href={{
                pathname: "/po",
                query: {
                  orderString: orderString,
                },
              }}
            >
              <button
                disabled={orderString == ""}
                className={`${orderString === ""
                  ? "decoration-re-gray-300"
                  : "decoration-re-blue"
                  } decoration-1 underline underline-offset-2 px-1`}
              >
                generate
              </button>
            </Link>
            <h2 className="text-center mr-1">purchase order</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
