import { Product, ProductDevelopment, Sku } from ".prisma/client";
import { CheckoutType } from "../../utils/checkoutUtils";
import { getOrderStringTotal } from "../../utils/dashboard/orderStringUtils";

export default function Totals({
  orderString,
  productDevelopment,
  products,
  skus,
  type,
}: {
  orderString: string;
  productDevelopment: ProductDevelopment | null;
  products: Product[] | null;
  skus: Sku[] | null;
  type: CheckoutType;
}): JSX.Element[] {
  let items: JSX.Element[] = [];

  if (type == CheckoutType.PRODUCT_DEVELOPMENT && productDevelopment) {
    const total = (
      (productDevelopment.developmentFee + productDevelopment.researchFee) *
      productDevelopment.split
    ).toFixed(2);
    const completionSplit = parseFloat(
      (1 - productDevelopment.split).toFixed(2)
    );

    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200 text-xs"
        key="initiation"
      >
        <div className="">
          <div className="mb-0.5">{`${
            productDevelopment.split * 100
          }% due on initiation`}</div>
        </div>
        <div className="">
          <div className="mb-0.5">{`\$${
            (productDevelopment.developmentFee +
              productDevelopment.researchFee) *
            productDevelopment.split
          }`}</div>
        </div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200"
        key="completion"
      >
        <div className="">
          <div className="text-xs mb-0.5">{`${
            completionSplit * 100
          }% due on completion`}</div>
        </div>
        <div className="">
          <div className="text-xs mb-0.5">{`\$${
            (productDevelopment.developmentFee +
              productDevelopment.researchFee) *
            completionSplit
          }`}</div>
        </div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200 text-sm"
        key="subtotal"
      >
        <div className="">
          <div className="font-semibold mb-0.5">Subtotal</div>
        </div>
        <div className="">
          <div className="font-semibold mb-0.5">{`\$${
            productDevelopment.developmentFee + productDevelopment.researchFee
          }`}</div>
        </div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-8 mt-4"
        key="total"
      >
        <div className="">
          <div className="text-sm font-bold mb-0.5">Total due today</div>
        </div>
        <div className="">
          <div className="text-sm font-bold mb-0.5">{`\$${total}`}</div>
        </div>
      </div>
    );
  }

  if (type == CheckoutType.ORDER && products && skus) {
    const subtotal = getOrderStringTotal(orderString, products, skus);
    const total = getOrderStringTotal(orderString, products, skus, 1.07);
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-0.5 text-gray-200"
        key="subtotal"
      >
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Subtotal</div>
        </div>
        <div className="">
          <div className="text-sm font-semibold mb-0.5">{`$${subtotal.toFixed(
            2
          )}`}</div>
        </div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-4 text-gray-300"
        key="tax"
      >
        <div className="">
          <div className="text-xs font-semibold mb-0.5">Tax (7%)</div>
        </div>
        <div className="">
          <div className="text-xs font-semibold mb-0.5">{`$${(
            total - subtotal
          ).toFixed(2)}`}</div>
        </div>
      </div>
    );
    items.push(
      <div
        className="flex columns-2 pl-16 justify-between mr-6 mb-8"
        key="total"
      >
        <div className="">
          <div className="text-sm font-semibold mb-0.5">Total due</div>
        </div>
        <div className="">
          <div className="text-sm font-semibold mb-0.5">{`$${total.toFixed(
            2
          )}`}</div>
        </div>
      </div>
    );
  }

  return items;
}
