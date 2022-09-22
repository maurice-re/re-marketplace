import { Product, Sku } from "@prisma/client";
import { nanoid } from "../api/apiUtils";


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
          mainImage: getMainImage(product.id, color),
          color: color,
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

export function make20Ids() {
  const output = []
  for (let i = 0; i < 20; i++) {
    output.push(nanoid())
  }
  console.log(output)
  return output;
}

// const headQuarterEvents = {
//   "re_SB21.5RPPG_zD0JIPa29d8e" : ["borrow:100", "eol"]
//   "re_SB21.5RPPG_9lR2XOcL34y6" : ["borrow:74", "eol"]
//   "re_SB21.5RPPG_3Znfb30b8VzK" : ["borrow:70", "eol"]
//   "re_SB21.5RPPG_BULCV1EZJn6u" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_im44uQ2XUvYm" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_kCr1vkJlljZM" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_mPAOEWdbKIE5" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_wUaELDOsdBR7" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_QF7EHd7pMiK8" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_VXr3YhVvM0Tm" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_qEkV5wX6M9aG" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_T7lu9gIOsKPf" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_vXsE4I3FbK02" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_tDUDSWkAT0gP" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_6nYQ5GexUjzk" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_8WEG3w1iSrRb" : ["borrow:20", "lost"]
//   "re_SB21.5RPPG_i1GDNUEhrTre" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_d7RPv2t7TH5e" : ["borrow:50", "eol"]
//   "re_SB21.5RPPG_SlRWoNrNPN6H" : ["borrow:50", "eol"]
// }
