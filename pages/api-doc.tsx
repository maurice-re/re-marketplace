import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import Head from "next/head";
import { SwaggerUIProps } from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import apiSpec from "../utils/api/tracking-doc.json";

const SwaggerUI = dynamic<SwaggerUIProps>(() => import("swagger-ui-react"), {
  ssr: false,
});

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="w-screen h-screen bg-white pt-2">
      <Head>
        <title>Api Docs</title>
        <meta name="account" content="Manage your account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SwaggerUI spec={spec} />
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: apiSpec,
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
