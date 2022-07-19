import { useRouter } from "next/router";
import allProducts from "../../content/products.json";
import allSkus from "../../content/skus.json";
import { useFormState } from "../../context/form-context";

function SkuQuantityField({
  material,
  productId,
  size,
}: {
  material: string;
  productId: string;
  size: string;
}) {
  const { addToCart, cart } = useFormState();
  const router = useRouter();
  const { city } = router.query;

  const product = allProducts.filter((p) => p.id == productId)[0];
  const sku = allSkus.filter(
    (sku) => sku.material == material && sku.size == size
  )[0];

  function handleChange(quantity: string) {
    addToCart(sku.id, quantity, city!.toString());
    console.log(cart);
  }

  return (
    <div className="flex justify-between items-center mb-2" key={sku.id}>
      <div className="">
        <div className="text-white text-25 font-theinhardt">{product.name}</div>
        <div className="text-white text-xs font-theinhardt-300">{`(\$${sku.price} each)`}</div>
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
