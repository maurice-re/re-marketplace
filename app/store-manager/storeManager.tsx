"use client";

import Image from "next/image";
import { useState } from "react";
import { FullProduct, FullSku } from "../server-store";

export default function StoreManager({
  products,
}: {
  products: FullProduct[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<
    FullProduct | undefined
  >();
  const [selectedSku, setSelectedSku] = useState<FullSku | undefined>();

  return (
    <main className="flex h-full w-full overflow-y-auto font-theinhardt">
      <div className="flex h-full w-3/5 flex-col">
        <h1>Products</h1>
        <ul className="flex gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className={`rounded-md border-3 ${
                selectedProduct == product
                  ? "border-re-green-700 hover:border-re-green-300"
                  : "border-re-black hover:border-white"
              }  active:border-re-green-600`}
              onClick={() => setSelectedProduct(product)}
            >
              <div>
                <Image
                  src={product.mainImage}
                  alt={`Image for ${product.name}`}
                  width={128}
                  height={128}
                  className="rounded-sm"
                />
                <h2 className="text-center">
                  {product.id + ": " + product.name}
                </h2>
              </div>
            </li>
          ))}
        </ul>
        <h1>Skus</h1>
      </div>
      <div className="h-full w-2/5 bg-re-dark-green-300">
        <EditCard product={selectedProduct} sku={selectedSku} />
      </div>
    </main>
  );
}

function EditCard({ product, sku }: { product?: FullProduct; sku?: FullSku }) {
  if (sku) {
    return <SkuCard sku={sku} />;
  } else if (product) {
    return <ProductCard product={product} />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1>Select a product or sku</h1>
    </div>
  );
}

function ProductCard({ product }: { product: FullProduct }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center gap-3
      "
    >
      <h1 className="text-2xl">{product.id + ": " + product.name}</h1>
      <Image
        src={product.mainImage}
        alt={`Image for ${product.name}`}
        width={172}
        height={172}
        className="rounded-md"
      />
      <label>
        Active
        <input type="checkbox" className="toggle" checked={product.active} />
      </label>
      <label>
        Colors
        <TagList tags={product.colors.split(", ")} />
      </label>
      <label>
        Description
        <div className="rounded border-2 border-re-gray-300 p-1">
          {product.description}
        </div>
      </label>
      <label>
        Materials
        <TagList tags={product.materials.split(", ")} />
      </label>
      <label>
        Sizes
        <TagList tags={product.sizes.split(", ")} />
      </label>
    </div>
  );
}

function SkuCard({ sku }: { sku: FullSku }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center gap-3
      "
    >
      <h1 className="text-2xl">{sku.product.name}</h1>
      <Image
        src={sku.mainImage}
        alt={`Image for ${sku.product.name}`}
        width={172}
        height={172}
        className="rounded-md"
      />
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-re-gray-300 px-2 py-1 text-white"
        >
          {tag}
        </span>
      ))}
      <span
        key={"add"}
        className="rounded-md bg-re-gray-300 px-2 py-1 text-white"
      >
        {"+ Add"}
      </span>
    </div>
  );
}
