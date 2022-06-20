import { useAppContext } from "../../context/context-provider";
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
  const [context, updateAppContext] = useAppContext();

  const sku: string = product.getSku(size, material);

  function handleChange(quantity: string, sku: string) {
    let changedSKU = product.sku.get(sku) ?? new SKU("", "", "");
    changedSKU.quantity = quantity;
    context.addToCart(changedSKU);
    console.log(context.cart);
    updateAppContext(context);
  }

  return (
    <li className={styles.listItem} key={sku}>
      <div className={styles.quantityTitle}>{size + " " + material}</div>
      <input
        type="text"
        className={styles.quantityInput}
        onChange={(e) => handleChange(e.target.value, sku)}
      />
    </li>
  );
}

export default SkuQuantityField;
