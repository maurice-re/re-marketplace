import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ProductPage from "../../components/form/product-page";
import ProgressBar from "../../components/form/progress-bar";
import ReLogo from "../../components/form/re-logo";

const Product: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const productId = id == "swapcup" ? "SC1" : "SB2";

  return (
    <div className="w-screen h-screen bg-black flex">
      <Head>
        <title>Customize your product</title>
        <meta name="product" content="Info on product from the Re catalog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProgressBar pageName={router.asPath.slice(6)} />
      <ReLogo />
      <ProductPage productId={productId} route={router.asPath.slice(6)} />
    </div>
  );
};

export default Product;
