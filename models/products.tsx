export class Product {
  title: string;
  materials: string[];
  sizes: string[];
  image: string;
  sku: Map<string, SKU>;

  constructor(
    title: string,
    sizes: string[],
    materials: string[],
    image: string
  ) {
    this.title = title;
    this.materials = materials;
    this.sizes = sizes;
    this.image = image;

    this.sku = new Map<string, SKU>();
    this.sku.set("0", new SKU("Error", "", ""));
    sizes.forEach((size, index) => {
      materials.forEach((material, mIndex) => {
        this.sku.set(
          index.toString() + mIndex.toString(),
          new SKU(size + " " + material, image, "")
        );
      });
    });
  }

  getSku(size: string, material: string): string {
    if (this.sizes.includes(size) && this.materials.includes(material)) {
      return (
        this.sizes.indexOf(size).toString() +
        this.materials.indexOf(material).toString()
      );
    }
    return "0";
  }

  getSkuFromTitle(title: string): string {
    const sep = title.split(" ");
    console.log(sep);
    const size = sep[0] + " " + sep[1];
    const material = sep.slice(2).join(" ");
    console.log("size");
    console.log(size);
    console.log(material);
    return this.getSku(size, material);
  }
}

export class SKU {
  title: string;
  image: string;
  quantity: string;

  constructor(title: string, image: string, quantity: string) {
    this.title = title;
    this.image = image;
    this.quantity = quantity;
  }
}
