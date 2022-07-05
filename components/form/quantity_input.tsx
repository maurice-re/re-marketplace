import { useRouter } from "next/router";
import { useAppContext } from "../../context/context-provider";
import { Product, SKU } from "../../models/products";

function SkuQuantityField({
  material,
  product,
  size,
}: {
  material: string;
  product: Product;
  size: string;
}) {
  const [context, updateAppContext] = useAppContext();
  const router = useRouter();
  const { city } = router.query;
  console.log(city);

  const skuID: string = product.getSku(size, material);
  const sku = product.sku.get(skuID);

  function handleChange(quantity: string) {
    let changedSKU = sku ?? new SKU("", "", "");
    changedSKU.quantity = quantity;
    context.addToCart(changedSKU, city?.toString() ?? "");
    console.log(context.cart);
    updateAppContext(context);
  }

  return (
    <div className="flex justify-between items-center mb-2" key={skuID}>
      <div className="">
        <div className="text-white text-25 font-theinhardt">{sku?.title}</div>
        <div className="text-white text-xs font-theinhardt-300">{`(${sku?.priceString})`}</div>
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
