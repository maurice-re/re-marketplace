import { Location, Product, ProductDevelopment, Sku } from ".prisma/client";
import Image from "next/image";
import { CheckoutType } from "../../utils/checkoutUtils";
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../utils/prisma/dbUtils";

export default function LineItems({
  locations,
  orderString,
  productDevelopment,
  products,
  skus,
  showLocation,
  type,
}: {
  locations: Location[] | null;
  orderString: string;
  productDevelopment: ProductDevelopment | null;
  products: Product[] | null;
  showLocation: boolean;
  skus: Sku[] | null;
  type: CheckoutType;
}): JSX.Element {
  console.log(orderString);
  const items: JSX.Element[] = [];

  if (type == CheckoutType.PRODUCT_DEVELOPMENT && productDevelopment) {
    items.push(
      <div
        className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
        key="researchFee"
      >
        <div className="flex columns-2 justify-start items-center">
          <div className="h-12 w-12 overflow-hidden rounded-10 flex mr-3 border items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <div className="text-sm font-semibold mb-0.5">Design Research</div>
        </div>
        <div className="text-sm font-semibold mb-0.5">{`$${productDevelopment.researchFee}`}</div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
        key="Development Fee"
      >
        <div className="flex columns-2 justify-start items-center">
          <div className="h-12 w-12 overflow-hidden rounded-10 flex mr-3 border items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <div className="text-sm font-semibold mb-0.5">
            Product Development
          </div>
        </div>
        <div className="text-sm font-semibold mb-0.5">{`$${productDevelopment.developmentFee}`}</div>
      </div>
    );
  }

  if (type == CheckoutType.ORDER && products && skus && locations) {
    orderString.split("*").forEach((ordersByLocation) => {
      const locationId = ordersByLocation.split("_")[0];
      const lineItems = ordersByLocation.split("_").slice(1);
      const location = locations.find((loc) => loc.id == locationId);
      if (!location) {
        //TODO: handle error
        return;
      }
      items.push(
        <div className="flex w-5/6 gap-3 mb-4" key={locationId}>
          <div
            className={`px-5 py-4 bg-re-dark-green-300 border border-re-gray-300 rounded-md ${
              showLocation ? "w-3/5" : "w-full"
            }`}
          >
            <div className="mb-5 text-lg">{`${
              location.displayName ?? location.city
            } orders`}</div>
            {lineItems.map((lineItem) => {
              const [skuId, quantity] = lineItem.split("~");
              const sku: Sku = skus.find((s) => s.id == skuId) as Sku;
              const product: Product = products.find(
                (p) => (p.id = sku.productId)
              ) as Product;

              return (
                <div
                  className="flex justify-start mb-5"
                  key={skuId + locationId}
                >
                  <Image
                    className="bg-red-400 rounded mr-2"
                    src={sku.mainImage}
                    alt={"Image of product"}
                    width={96}
                    height={96}
                  />
                  <div className="flex flex-col flex-grow h-24">
                    <div className="flex justify-between items-center">
                      <div>{sku.materialShort + " " + product.name}</div>
                      <div className="text-xl">{`$${calculatePriceFromCatalog(
                        skus,
                        skuId,
                        quantity
                      ).toFixed(2)}`}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-base text-re-gray-text">
                        {sku.size +
                          " · " +
                          sku.color.charAt(0).toUpperCase() +
                          sku.color.slice(1)}
                      </div>
                      <div className="text-sm text-re-gray-text">{`$${getPriceFromTable(
                        sku.priceTable,
                        quantity
                      ).toFixed(2)} each`}</div>
                    </div>
                    <div className="flex-grow" />
                    <div className=" items-end">{`Qty ${quantity}`}</div>
                  </div>
                </div>
              );
            })}
            <div>Shipping</div>
            <div className="flex justify-between">
              <div className="text-re-gray-text">{`Shenzen to ${location.city} 7-10 days`}</div>
              <div className="text-re-gray-text">Calculated later</div>
            </div>
          </div>
          {showLocation && (
            <div className=" w-2/5 flex flex-col justify-center">
              <div className="bg-re-dark-green-500 border border-re-gray-300 rounded-md flex flex-col">
                <div className="p-4">{`${
                  location.displayName ?? location.city
                } shipping address`}</div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div
                  className={`px-6 py-2 ${
                    location.displayName ? "text-white" : "text-re-gray-text"
                  }`}
                >
                  {location.displayName ? location.displayName : "Display Name"}
                </div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div className="px-6 py-2">{location.country}</div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div className="px-6 py-2">{location.line1}</div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div
                  className={`px-6 py-2 ${
                    location.line2 && location.line2.length > 1
                      ? "text-white"
                      : "text-re-gray-text"
                  }`}
                >
                  {location.line2 ? location.line2 : "Line 2"}
                </div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div className="flex">
                  <div className="pl-6 py-2 w-1/3">{location.city}</div>
                  <div className="w-px h-full bg-re-gray-300" />
                  <div className="px-6 py-2">{location.zip}</div>
                </div>
                <div className="h-px bg-re-gray-300 w-full"></div>
                <div className="px-6 py-1">{location.state}</div>
              </div>
            </div>
          )}
        </div>
      );
    });
  }
  // console.log(items);

  return <>{items}</>;
}
