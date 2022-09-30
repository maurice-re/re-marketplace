import { Product, Sku } from "@prisma/client";


function getMaterialShort(material: string): string {
  switch (material) {
    case "Polypropylene":
      return "PP";
    default:
      return "RPP";
  }
}

function getMainImage(product: string, color: string): string {
  if (product == "SC1") {
    return "/images/swapcup_main.png";
  } else {
    return "/images/swapbox_main.png";
  }
}

export const getSkusFromProduct = (productCatalog: Product[]): Sku[] => productCatalog.reduce((prev, product) => {
  const options: Sku[] = [];

  product.colors.split(", ").forEach((color) =>
    product.sizes.split(", ").forEach((size) =>
      product.materials.split(", ").forEach((material) => {
        const short = getMaterialShort(material);
        options.push({
          id: [product.id, size.split(" ")[0],short, color.toUpperCase()].join('-'),
          color: color,
          mainImage: getMainImage(product.id, color),
          material: material,
          materialShort: short,
          productId: product.id,
          priceTable: "0:10",
          size: size,
        });
      })
    )
  );

  return prev.concat(options);
}, [] as Sku[])