import { Status } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import {
  skuName,
  SkuProduct,
  totalFromOrders,
} from "../../utils/dashboard/dashboardUtils"; // TODO(Suhana): Stop using dashboardUtils for sample
import { SampleTransactionOrders } from "../../utils/sample/sampleUtils";
import { calculatePriceFromCatalog } from "../../utils/prisma/dbUtils";
import Link from "next/link";

function SampleOrder({ skus }: { skus: SkuProduct[] }) {
  const [selected, setSelected] = useState<SkuProduct[]>([]);
  const [skuIds, setSkuIds] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const [skuIdQuantity, setSkuIdQuantity] = useState<[SkuProduct, string][]>(
    []
  );

  // TODO(Suhana): Remove redundancies between this and quickOrder

  // TODO(Suhana): quantity field in SampleTransaction is not used, and '1' is hardcoded as the quantity for each sku sample here - fix

  function handleItemPress(skuSelected: SkuProduct) {
    const isSelected = selected.find((s) => s.id == skuSelected.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((s) => s.id != skuSelected.id));
      console.log("1");
      console.log(
        calculatePriceFromCatalog(
          skuSelected,
          skuSelected.product,
          skuSelected.id,
          1
        )
      );
      setAmount(
        amount +
          calculatePriceFromCatalog(
            skuSelected,
            skuSelected.product,
            skuSelected.id,
            1
          )
      );
      setSkuIdQuantity((prev) => prev.filter((s) => s[0].id != skuSelected.id));
    } else {
      setSelected((prev) => [...prev, skuSelected]);
      console.log("2");
      console.log(
        calculatePriceFromCatalog(
          skuSelected,
          skuSelected.product,
          skuSelected.id,
          1
        )
      );
      setAmount(
        amount +
          calculatePriceFromCatalog(
            skuSelected,
            skuSelected.product,
            skuSelected.id,
            1
          )
      );
      setSkuIdQuantity((prev) => [...prev, [skuSelected, "0"]]);
    }
  }

  function handleBuyNow(): string {
    // Pass the new SampleTransaction

    const now = new Date();

    // {
    //   id: "",
    //   amount: calculatePriceFromCatalog(sku, sku.product, sku.id, 1),
    //   comments: null,
    //   company: {
    //     customerId: "",
    //   },
    //   companyId: "",
    //   createdAt: now,
    //   location: "",
    //   locationId: "",
    //   quantity: 1,
    //   qrCode: false,
    //   shippedAt: now,
    //   receivedAt: now,
    //   status: Status.PROCESSING,
    //   skuId: sku.id,
    //   sku: sku,
    //   sampleTransactionId: "",
    //   userId: "",
    //   sample: true,
    // };

    const skuIds = selected
      .map((sku) => {
        return sku.id;
      })
      .join(", ");

    console.log("SKUIDS HERE");
    console.log(skuIds);

    console.log("AMOUNT W/OUT TAX");
    console.log(amount);

    const transaction: SampleTransactionOrders = {
      id: "",
      amount,
      createdAt: now,
      quantity: 1,
      locationId: "",
      companyId: "",
      skuIds,
      status: Status.PROCESSING,
    };

    console.log("FULLY FORMED TRANSACTION");
    console.log(transaction);

    return JSON.stringify(transaction);
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
              </div>
            ))}
            <div className="flex justify-between mb-2">
              <div>Total:</div>
              <div>{`\ $${amount.toFixed(2)}`}</div>
            </div>
            <div className="h-px mb-3 bg-white bg-opacity-70" />
            {/* <Link
                    href={{
                      pathname: "/sample/checkout",
                      query: { orders: handleBuyNow() },
                    }}
                    as={`/sample/checkout/${new Date().getTime()}`}
                  > */}
            <button
              className="px-3 py-2 bg-re-gray-400 rounded-10 hover:bg-re-green-600 hover:text-black"
              onClick={handleBuyNow}
            >
              Buy now
            </button>
            {/* </Link> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleOrder;
