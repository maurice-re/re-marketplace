import Image from "next/image";
import { useState } from "react";
import { skuName, SkuProduct } from "../../utils/dashboard/dashboardUtils";

function SampleOrder({ skus }: { skus: SkuProduct[] }) {
  const [selected, setSelected] = useState<SkuProduct[]>([]);

  function handleItemPress(skuSelected: SkuProduct) {
    if (selected) {
      setSelected([]);
    }
    setSelected([skuSelected]);
  }

  return (
    <div className="flex flex-col mx-1 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
      <h1 className=" text-re-green-500 font-theinhardt text-2xl mb-2">
        Quick Order
      </h1>
      <div className=" h-px bg-white mb-4 w-full" />
      <div className="flex justify-between w-full gap-4">
        <div
          className={`grid gap-4 h-96 overflow-y-scroll w-full pr-1 items-start ${
            selected.length == 0
              ? "2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 grid-cols-4"
              : "2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2"
          }`}
        >
          {skus.map((sku) => (
            <div
              key={sku.id}
              className="flex flex-col items-center mx-1 mb-2 group"
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
          <div className="flex flex-col justify-start">
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
                <div className="w-1/2 h-full">
                  {/* {clientSecret && (
            // eslint-disable-next-line
            <Elements options={options} stripe={stripePromise}>
              <CheckoutInfo
                order={order}
                transaction={transaction}
                paymentMethods={paymentMethods}
                paymentId={paymentId}
              />
            </Elements>
          )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleOrder;
