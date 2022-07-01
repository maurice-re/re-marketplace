import { useRouter } from "next/router";
import { useFormState } from "../../context/form-context";
import { Product, SKU } from "../../models/products";
import styles from "../../styles/Form.module.css";

function SkuQuantityField({
  material,
  product,
  size,
}: {
  material: string;
  product: Product;
  size: string;
}) {
  const { addToCart, cart } = useFormState();
  const router = useRouter();
  const { city } = router.query;
  console.log(city);

  const skuID: string = product.getSku(size, material);
  const sku = product.sku.get(skuID);

  function handleChange(quantity: string) {
    let changedSKU = sku ?? new SKU("", "", "");
    changedSKU.quantity = quantity;
    addToCart(changedSKU, city?.toString() ?? "");
    console.log(cart);
  }

  return (
    <div className="flex justify-between ml-2 mr-20" key={skuID}>
      <div className="flex-col w-40 mb-3">
        <div className="text-lg mt-2">{sku?.title}</div>
        <div className={styles.price}>{`(${sku?.priceString})`}</div>
      </div>
      <input
        type="text"
        className={styles.quantityInput}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

export default SkuQuantityField;
