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

  const skuID: string = product.getSku(size, material);
  const sku = product.sku.get(skuID);

  function handleChange(quantity: string, skuID: string) {
    let changedSKU = sku ?? new SKU("", "", "");
    changedSKU.quantity = quantity;
    context.addToCart(changedSKU);
    console.log(context.cart);
    updateAppContext(context);
  }

  return (
    <li className={styles.listItem} key={skuID}>
      <div style={{ fontSize: 0 }}>
        <span className={styles.quantityTitle}>{sku?.title}</span>
        <span className={styles.price}>{`(${sku?.price})`}</span>
      </div>
      <input
        type="text"
        className={styles.quantityInput}
        onChange={(e) => handleChange(e.target.value, skuID)}
      />
    </li>
  );
}

export default SkuQuantityField;
