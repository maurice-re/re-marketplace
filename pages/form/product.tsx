import { Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormNextButton from "../../components/form/next-button";
import FormOptionButton from "../../components/form/option-button";
import ProgressBar from "../../components/form/progress-bar";
import SkuQuantityField from "../../components/form/quantity_input";
import ReLogo from "../../components/form/re-logo";
import { useFormStore } from "../../stores/formStore";

const emptyProduct = {
  id: "",
  active: true,
  colors: "",
  name: "",
  sizes: "",
  materials: "",
  priceTable: "",
  mainImage: "/images/swapbox_main.png",
};

const Product: NextPage = () => {
  const router = useRouter();
  const { locations, productCatalog } = useFormStore((state) => ({
    locations: state.locations,
    productCatalog: state.productCatalog,
  }));

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [chosenSizes, setChosenSizes] = useState<string[]>([]);
  const [chosenMaterial, setChosenMaterial] = useState<string[]>([]);

  useEffect(() => {
    setChosenSizes([]);
    setChosenMaterial([]);
  }, [router.asPath]);

  const { id, city } = router.query;
  useEffect(() => {
    if (productCatalog) {
      const productId = id == "swapcup" ? "SC1" : "SB1";
      const _product =
        productCatalog.find((p) => productId == p.id) ?? emptyProduct;
      setProduct(_product);
    }
  }, [id, productCatalog]);

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
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Customize your product</title>
        <meta name="product" content="Info on product from the Re catalog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={router.asPath.slice(6)} />
      <ReLogo />
      <main className="flex flex-col container mx-auto my-4 justify-evenly">
        <div className=" text-white text-5xl text-center font-theinhardt">
          {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
        </div>
        <div className="flex justify-evenly">
          <div className="w-124 h-124 relative">
            <div className="w-120 h-120 bg-re-blue right-1 bottom-0 absolute z-0 rounded-2xl"></div>
            <Image
              src={product.mainImage}
              width={484}
              height={484}
              alt={product.name}
              className="rounded-2xl z-10 relative"
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
        <FormNextButton
          pageName={router.asPath.slice(6)}
          disabled={false}
          option
          green
        />
      </main>
    </div>
  );
};

export default Product;

// export async function getStaticProps(context: GetStaticPropsContext) {
//   const products = await prisma.product.findMany({});
//   return {
//     props: {
//       products: JSON.parse(JSON.stringify(products)),
//     },
//   };
// }
