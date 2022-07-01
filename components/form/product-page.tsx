import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateOptionsList } from "../../constants/form";
import { useFormState } from "../../context/form-context";
import { Product } from "../../models/products";
import styles from "../../styles/Form.module.css";
import FormNextButton from "./next-button";
import SkuQuantityField from "./quantity_input";

function ProductPage({ product, route }: { product: Product; route: string }) {
  const [chosenSizes, setChosenSizes] = useState<string[]>([]);
  const [chosenMaterial, setChosenMaterial] = useState<string[]>([]);
  const { locations } = useFormState();
  const router = useRouter();
  const { city } = router.query;
  useEffect(() => {
    setChosenSizes([]);
    setChosenMaterial([]);
  }, [route]);
  const sizes = generateOptionsList(
    product.sizes,
    chosenSizes,
    setChosenSizes,
    true
  );
  const materials = generateOptionsList(
    product.materials,
    chosenMaterial,
    setChosenMaterial,
    false
  );

  const skus = chosenSizes
    .sort((a, b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]))
    .map((size) => (
      <SkuQuantityField
        material={chosenMaterial[0]}
        product={product}
        size={size}
        key={product.getSku(size, chosenMaterial[0])}
      />
    ));

  return (
    <main className={styles.main}>
      <div className={styles.row}>
        <div className={styles.pictureColumn}>
          <Image
            src={product.image}
            width={500}
            height={500}
            alt={product.title}
            priority
          />
        </div>
        <div id="options" className={styles.column}>
          <h1 className="text-4xl font-medium mb-1">
            {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
          </h1>
          <div
            style={{
              border: "2px solid transparent",
            }}
          >
            <h2 className="text-lg mt-2">Choose your size(s)</h2>
            <ul className={styles.grid}>{sizes}</ul>
          </div>
          <div>
            <h2 className="text-lg mt-2">Choose your material</h2>
            <ul className={styles.grid}>{materials}</ul>
          </div>
          {chosenSizes.length > 0 && chosenMaterial.length > 0 && (
            <div>
              <div>
                <h2 className="text-lg mt-2">{`Choose your quanity${
                  locations.length > 1 ? ` for ${city}` : ""
                }`}</h2>
                {skus}
              </div>
              <FormNextButton pageName={route} disabled={false} option />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
