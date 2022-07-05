import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateOptionsList } from "../../constants/form";
import { useAppContext } from "../../context/context-provider";
import { Product } from "../../models/products";
import FormNextButton from "./next-button";
import SkuQuantityField from "./quantity_input";

function ProductPage({ product, route }: { product: Product; route: string }) {
  const [chosenSizes, setChosenSizes] = useState<string[]>([]);
  const [chosenMaterial, setChosenMaterial] = useState<string[]>([]);
  console.log(chosenMaterial);
  const [context, _] = useAppContext();
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
    <main className="flex flex-col container mx-auto my-4 justify-evenly">
      <div className=" text-white text-5xl text-center font-theinhardt">
        {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
      </div>
      <div className="flex justify-evenly">
        <div className="w-124 h-124 relative">
          <div className="w-120 h-120 bg-re-blue right-1 bottom-0 absolute rounded-2xl"></div>
          <Image
            src={product.image}
            width={484}
            height={484}
            alt={product.title}
            priority
            className="rounded-2xl"
          />
        </div>
        <div id="options" className="w-124">
          <div className="mb-8">
            <h2 className="text-white text-25 font-theinhardt-300 mb-2">
              Choose your size (s)
            </h2>
            <div className="flex flex-wrap">{sizes}</div>
          </div>
          <div className="mb-8">
            <h2 className="text-white text-25 font-theinhardt-300 mb-2">
              Choose your material
            </h2>
            <div className="flex flex-wrap">{materials}</div>
          </div>
          {chosenSizes.length > 0 && chosenMaterial.length > 0 && (
            <div>
              <h2 className="text-white text-25 font-theinhardt-300 mb-2">
                Choose your quanity
                <span>{context.locations.length > 1 ? " for " : ""}</span>
                <span className=" text-re-green-500">
                  {context.locations.length > 1 ? `${city}` : ""}
                </span>
              </h2>
              {skus}
            </div>
          )}
        </div>
      </div>
      <FormNextButton pageName={route} disabled={false} option green />
    </main>
  );
}

export default ProductPage;
