import { Product, Sku } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormStore, useFormStore } from "../../stores/formStore";
import { getPriceFromTable } from "../../utils/prisma/dbUtils";

function SkuQuantityField({
  material,
  productId,
  size,
}: {
  material: string;
  productId: string;
  size: string;
}) {
  const { addToCart, canCheckout, skuCatalog, productCatalog } = useFormStore(
    (state: FormStore) => ({
      addToCart: state.addToCart,
      canCheckout: state.canCheckout,
      skuCatalog: state.skuCatalog,
      productCatalog: state.productCatalog,
    })
  );
  const searchParams = useSearchParams();
  const city = searchParams ? searchParams.get("city") : "";

  const product = productCatalog.filter((p: Product) => p.id == productId)[0];
  const sku = skuCatalog.filter(
    (sku: Sku) => sku.material == material && sku.size == size
  )[0];

  const [quantity, setQuantity] = useState<number>(0);

  function handleChange(quantity: string) {
    addToCart(sku.id, quantity, city?.toString() ?? "");
    setQuantity(parseInt(quantity == "" ? "0" : quantity));
  }

  return (
    <div className="flex justify-between items-center mb-2" key={sku.id}>
      <div className="">
        <div className="text-white text-25 font-theinhardt">
          {sku.size + " " + product.name}
        </div>
        {canCheckout && (
          <div className="text-white text-xs font-theinhardt-300">{`($${getPriceFromTable(
            sku.priceTable,
            quantity
          )} each)`}</div>
        )}
      </div>

      <div className="flex mr-2">
        <input
          type="text"
          className="bg-re-black border-2 border-white text-white font-theinhardt-300 text-25 text-center w-36 rounded-10 py-1"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SkuQuantityField;
