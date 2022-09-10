import { Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ProductPage from "../../components/form/product-page";
import ProgressBar from "../../components/form/progress-bar";
import ReLogo from "../../components/form/re-logo";
import prisma from "../../constants/prisma";
import { useFormState } from "../../context/form-context";

type ProductProps = {
  _products: Product[];
};

const Product: NextPage<ProductProps> = ({ _products }) => {
  const router = useRouter();
  const { id } = router.query;
  const productId = id == "swapcup" ? "SC1" : "SB2";
  const { productCatalog } = useFormState();
  const product: Product = _products.find((p) => productId == p.id)!;

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Customize your product</title>
        <meta name="product" content="Info on product from the Re catalog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={router.asPath.slice(6)} />
      <ReLogo />
      <ProductPage product={product} route={router.asPath.slice(6)} />
    </div>
  );
};

export default Product;

export async function getStaticProps() {
  const products = await prisma.product.findMany();

  return {
    props: {
      _products: JSON.parse(JSON.stringify(products)),
    },
  };
}
