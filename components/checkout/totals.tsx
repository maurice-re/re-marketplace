import { Product, ProductDevelopment, Sku } from ".prisma/client";
import { CheckoutType, getCheckoutTotal } from "../../utils/checkoutUtils";
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
}): JSX.Element {
  const items: JSX.Element[] = [];

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
          <div className="mb-0.5">{`${productDevelopment.split * 100
            }% due on initiation`}</div>
        </div>
        <div className="">
          <div className="mb-0.5">{`$${(productDevelopment.developmentFee +
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
          <div className="text-xs mb-0.5">{`${completionSplit * 100
            }% due on completion`}</div>
        </div>
        <div className="">
          <div className="text-xs mb-0.5">{`$${(productDevelopment.developmentFee +
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
          <div className="font-semibold mb-0.5">{`$${productDevelopment.developmentFee + productDevelopment.researchFee
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
          <div className="text-sm font-bold mb-0.5">{`$${total}`}</div>
        </div>
      </div>
    );
  }

  if (type == CheckoutType.ORDER && products && skus) {
    items.push(
      <div className="px-10 flex justify-between text-lg" key={"subtotal"}>
        <div>Subtotal</div>
        <div>
          {`$${getOrderStringTotal(
            orderString,
            products ?? [],
            skus ?? []
          ).toFixed(2)}`}
        </div>
      </div>
    );
    items.push(
      <div className="px-10 flex justify-between text-re-gray-text" key="tax">
        <div>Tax (7%)</div>
        <div>{`$${(
          getOrderStringTotal(orderString, products ?? [], skus ?? []) * 0.07
        ).toFixed(2)}`}</div>
      </div>
    );
    items.push(
      <div className="px-10 flex justify-between text-lg" key="total">
        <div>Total Payment</div>
        <div>
          {`$${getCheckoutTotal(
            orderString,
            null,
            products ?? [],
            skus ?? [],
            CheckoutType.ORDER
          ).toFixed(2)}
            `}
        </div>
      </div>
    );
  }

  return <>{items}</>;
}
