import { Location, Product, ProductDevelopment, Sku } from ".prisma/client";
import Image from "next/future/image";
import { CheckoutType } from "../../pages/dashboard/checkout";
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
  type,
}: {
  locations: Location[] | null;
  orderString: string;
  productDevelopment: ProductDevelopment | null;
  products: Product[] | null;
  skus: Sku[] | null;
  type: CheckoutType;
}) {
  let items: (JSX.Element | JSX.Element[])[] = [];

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

      if (orderString.split("*").length > 1) {
        items.push(
          <div key={"name " + locationId}>
            <div>{`${
              location ? location.displayName ?? location.city : location
            } orders`}</div>
          </div>
        );
      }
      items.push(
        lineItems.map((lineItem) => {
          const [skuId, quantity] = lineItem.split("~");
          console.log(orderString);
          const sku: Sku = skus.find((s) => s.id == skuId)!;
          const product: Product = products.find(
            (p) => (p.id = sku.productId)
          )!;
          return (
            <div
              className="flex columns-2 justify-between items-center mr-4 mt-5 mb-8"
              key={skuId + location ?? locationId}
            >
              <div className="flex columns-2 justify-start items-center">
                <div className="h-12 w-12 overflow-hidden rounded place-content-center mr-3">
                  <Image
                    src={sku.mainImage}
                    alt={product.name}
                    height={48}
                    width={48}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5">
                    {sku.size + " " + sku.materialShort + " " + product.name}
                  </div>
                  <div className="text-xs text-gray-300">{`Qty ${quantity}`}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">{`$${calculatePriceFromCatalog(
                  sku,
                  sku.id,
                  quantity
                )}`}</div>
                <div className="text-xs text-gray-300">{`\$${getPriceFromTable(
                  sku.priceTable,
                  quantity
                )} each`}</div>
              </div>
            </div>
          );
        })
      );
      items.push(
        <div
          className="flex columns-2 pl-16 justify-between mr-6 mb-8"
          key={"tax " + locationId}
        >
          <div className="">
            <div className="text-sm font-semibold mb-0.5">Shipping</div>
            <div className="text-xs text-gray-300">
              {location
                ? `Shenzen to ${location.city} 7-10 days`
                : `Ships from Shenzen 7-14 days`}
            </div>
          </div>
          <div className="">
            <div className="text-sm font-semibold mb-0.5">Calculated later</div>
          </div>
        </div>
      );
    });
  }

  return items;
}
