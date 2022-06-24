import { useRouter } from "next/router";
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
    <li className={styles.listItem} key={skuID}>
      <div style={{ fontSize: 0 }}>
        <span className={styles.quantityTitle}>{sku?.title}</span>
        <span className={styles.price}>{`(${sku?.priceString})`}</span>
      </div>
      <input
        type="text"
        className={styles.quantityInput}
        onChange={(e) => handleChange(e.target.value)}
      />
    </li>
  );
}

export default SkuQuantityField;
