import { useRouter } from "next/router";
import { useState } from "react";
import { useFormState } from "../../context/form-context";
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
  const {
    addToCart,
    calculatePrice,
    canCheckout,
    cart,
    skuCatalog,
    productCatalog,
  } = useFormState();
  const router = useRouter();
  const { city } = router.query;

  const product = productCatalog.filter((p) => p.id == productId)[0];
  const sku = skuCatalog.filter(
    (sku) => sku.material == material && sku.size == size
  )[0];

  const [quantity, setQuantity] = useState<number>(0);

  function handleChange(quantity: string) {
    addToCart(sku.id, quantity, city!.toString());
    setQuantity(parseInt(quantity == "" ? "0" : quantity));
  }

  return (
    <div className="flex justify-between items-center mb-2" key={sku.id}>
      <div className="">
        <div className="text-white text-25 font-theinhardt">
          {sku.size + " " + product.name}
        </div>
        {canCheckout && (
          <div className="text-white text-xs font-theinhardt-300">{`(\$${getPriceFromTable(
            product.priceTable,
            quantity
          )} each)`}</div>
        )}
      </div>

      <div className="flex mr-2">
        <input
          type="text"
          className="bg-black border-2 border-white text-white font-theinhardt-300 text-25 text-center w-36 rounded-10 py-1"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SkuQuantityField;
