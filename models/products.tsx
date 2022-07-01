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

const titleToPrice: { [key: string]: number } = {
  "1.5 L Recycled Polypropylene": 9.85,
  "1 L Recycled Polypropylene": 8.82,
  "8 oz Recycled Polypropylene": 1,
  "16 oz Recycled Polypropylene": 3.5,
  "1.5 L Polypropylene": 9.85,
  "1 L Polypropylene": 8.82,
  "8 oz Polypropylene": 1,
  "16 oz Polypropylene": 3.5,
};

export class SKU {
  title: string;
  image: string;
  quantity: string;
  price: number;
  priceString: string;

  constructor(title: string, image: string, quantity: string) {
    this.title = title;
    this.image = image;
    this.quantity = quantity;

    this.price = titleToPrice[title];
    this.priceString = this.price ? `$${this.price.toFixed(2)} each` : "";
  }
}

export enum ProductTitles {
  SWAPBOX = "Swapbox",
  SWAPCUP = "Swapcup",
}

export enum ProductMaterials {
  RPP = "Recycled Polypropylene",
  PP = "Polypropylene",
}

export enum ProductSizes {
  LITER = "1 L",
  ONE_AND_HALF_LITER = "1 L",
  EIGHT_OUNCE = "8 oz",
  SIXTEEN_OUNCE = "16 oz",
}

type Product2 = {
  images: string[];
  locations: string[];
  material: string;
  name: string;
  numOrders: number;
  numSold: number;
  price: {
    quantity: number;
    price: number;
  }[];
  size: string;
};

const allproducts: Product2[] = [
  // Boxes
  {
    images: [],
    locations: [],
    material: ProductMaterials.RPP,
    name: ProductTitles.SWAPBOX,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 9.85,
      },
    ],
    size: ProductSizes.ONE_AND_HALF_LITER,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.RPP,
    name: ProductTitles.SWAPBOX,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 8.82,
      },
    ],
    size: ProductSizes.LITER,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.PP,
    name: ProductTitles.SWAPBOX,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 9.85,
      },
    ],
    size: ProductSizes.ONE_AND_HALF_LITER,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.PP,
    name: ProductTitles.SWAPBOX,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 8.82,
      },
    ],
    size: ProductSizes.LITER,
  },
  // Cups
  {
    images: [],
    locations: [],
    material: ProductMaterials.RPP,
    name: ProductTitles.SWAPCUP,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 10,
      },
    ],
    size: ProductSizes.SIXTEEN_OUNCE,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.PP,
    name: ProductTitles.SWAPCUP,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 10,
      },
    ],
    size: ProductSizes.SIXTEEN_OUNCE,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.RPP,
    name: ProductTitles.SWAPCUP,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 10,
      },
    ],
    size: ProductSizes.EIGHT_OUNCE,
  },
  {
    images: [],
    locations: [],
    material: ProductMaterials.PP,
    name: ProductTitles.SWAPCUP,
    numOrders: 0,
    numSold: 0,
    price: [
      {
        quantity: 0,
        price: 10,
      },
    ],
    size: ProductSizes.EIGHT_OUNCE,
  },
];
