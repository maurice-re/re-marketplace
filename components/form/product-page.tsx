import { Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormState } from "../../context/form-context";
import FormNextButton from "./next-button";
import FormOptionButton from "./option-button";
import SkuQuantityField from "./quantity_input";

function ProductPage({ product, route }: { product: Product; route: string }) {
  const [chosenSizes, setChosenSizes] = useState<string[]>([]);
  const [chosenMaterial, setChosenMaterial] = useState<string[]>([]);
  const { locations } = useFormState();
  const router = useRouter();

  useEffect(() => {
    setChosenSizes([]);
    setChosenMaterial([]);
  }, [route]);

  const { city } = router.query;

  if (product == undefined) {
    return (
      <main className="flex flex-col container mx-auto my-4 justify-evenly">
        <div>An Error Occurred, please restart</div>
      </main>
    );
  }

  function handleOptionClick(
    optionLabel: string,
    selected: string[],
    setSelected: any,
    multipleChoice: boolean
  ) {
    if (multipleChoice) {
      if (selected.includes(optionLabel)) {
        setSelected(selected.filter((val) => val != optionLabel));
      } else {
        setSelected([...selected, optionLabel]);
      }
    } else {
      if (optionLabel == selected[0]) {
        setSelected("");
      } else {
        setSelected([optionLabel]);
      }
    }
  }

  const sizes = product.sizes
    .split(", ")
    .map((size) => (
      <FormOptionButton
        handleClick={() =>
          handleOptionClick(size, chosenSizes, setChosenSizes, true)
        }
        label={size}
        selected={chosenSizes.includes(size)}
        key={size}
      />
    ));

  const materials = product.materials
    .split(", ")
    .map((material) => (
      <FormOptionButton
        handleClick={() =>
          handleOptionClick(material, chosenMaterial, setChosenMaterial, false)
        }
        label={material}
        selected={chosenMaterial.includes(material)}
        key={material}
      />
    ));

  const skus = chosenSizes
    .sort((a, b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]))
    .map((size) => (
      <SkuQuantityField
        material={chosenMaterial[0]}
        productId={product.id}
        size={size}
        key={size + chosenMaterial[0]}
      />
    ));

  return (
    <main className="flex flex-col container mx-auto my-4 justify-evenly">
      <div className=" text-white text-5xl text-center font-theinhardt">
        {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
      </div>
      <div className="flex justify-evenly">
        <div className="w-124 h-124 relative">
          <div className="w-120 h-120 bg-re-blue right-1 bottom-0 absolute rounded-2xl"></div>
          <Image
            src={product.mainImage}
            width={484}
            height={484}
            alt={product.name}
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
                Choose your quantity
                <span>{locations.length > 1 ? " for " : ""}</span>
                <span className=" text-re-green-500">
                  {locations.length > 1 ? `${city}` : ""}
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
