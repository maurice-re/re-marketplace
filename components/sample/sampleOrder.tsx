import { Status } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { skuName, SkuProduct } from "../../utils/dashboard/dashboardUtils"; // TODO(Suhana): Stop using dashboardUtils for sample
import {
  calculatePriceFromCatalog,
  getPriceFromTable,
} from "../../utils/prisma/dbUtils";
import { SampleOrderWithSkuID } from "../../utils/sample/sampleUtils";

function SampleOrder({ skus }: { skus: SkuProduct[] }) {
  const [selected, setSelected] = useState<SkuProduct[]>([]);
  const [amount, setAmount] = useState<number>(0);

  function calculateAmount(sku: SkuProduct): number {
    return calculatePriceFromCatalog(sku, sku.id, 1, 1.07);
  }

  // TODO(Suhana): Quantity field in SampleTransaction is not used, and '1' is hardcoded as the quantity for each sku sample here - fix

  function handleItemPress(skuSelected: SkuProduct) {
    const isSelected = selected.find((s) => s.id == skuSelected.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((s) => s.id != skuSelected.id));
      setAmount(amount - calculateAmount(skuSelected));
    } else {
      setSelected((prev) => [...prev, skuSelected]);
      setAmount(amount + calculateAmount(skuSelected));
    }
  }

  function handleBuyNow(): string {
    const now = new Date();

    const skuIds = selected
      .map((sku) => {
        return sku.id;
      })
      .join(", ");

    const transaction: SampleOrderWithSkuID = {
      id: "",
      amount,
      createdAt: now,
      quantity: 1,
      locationId: "",
      companyId: "",
      skuIds,
      status: Status.PROCESSING,
    };

    return JSON.stringify(transaction);
  }

  return (
    <div className="flex flex-col w-full mx-1 p-6 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
      <h1 className="text-re-green-500 font-theinhardt text-2xl mb-2">
        Products
      </h1>
      <div className="h-px bg-white mb-6 w-full" />
      <div className="flex justify-between w-full gap-4">
        <div
          className={`flex flex-wrap h-full w-full pr-1 items-start space-x-8 ${
            selected.length == 0 ? "w-full" : "w-5/6"
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
          <div className="flex flex-col justify-start w-1/6 border-l-2 pl-6">
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
                  {`\$${getPriceFromTable(sku.priceTable, 1)}`}
                </div>
              </div>
            ))}
            <div className="flex justify-between mb-2">
              <div>Total:</div>
              <div>{`\$${(amount / 1.07).toFixed(2)}`}</div>
            </div>
            <div className="h-px mb-4 bg-white bg-opacity-70" />
            <Link
              href={{
                pathname: "/sample/checkout",
                query: { transaction: handleBuyNow() },
              }}
              as={`/sample/checkout/${new Date().getTime()}`}
            >
              <button
                className="px-3 py-2 bg-re-gray-400 rounded-10 hover:bg-re-green-600 hover:text-black"
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleOrder;
