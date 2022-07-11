import { createCipheriv } from "crypto";
import FormOptionButton from "../components/form/option-button";
import { FormButtonModel } from "../models/form-button";
import { Product } from "../models/products";

export const business_types: FormButtonModel[] = [
  new FormButtonModel("Food", "types?id=food", "/icons/food.png", true),
  new FormButtonModel("Drinks", "types?id=drinks", "/icons/drinks.png", true),
];

export const food_types: FormButtonModel[] = [
  new FormButtonModel(
    "Wet Food",
    "product?id=swapbox",
    "/icons/soup.png",
    true
  ),
  new FormButtonModel(
    "Dry Food",
    "product?id=swapbox",
    "/icons/salad.png",
    true
  ),
  new FormButtonModel(
    "Crispy Food",
    "product?id=swapbox",
    "/icons/fries.png",
    true
  ),
  new FormButtonModel(
    "Frozen Food",
    "product?id=swapbox",
    "/icons/frozen-food.png",
    true
  ),
];
export const drink_types: FormButtonModel[] = [
  new FormButtonModel(
    "Hot Drinks",
    "product?id=swapcup",
    "/icons/tea-cup.png",
    true
  ),
  new FormButtonModel(
    "Alcoholic Drinks",
    "product?id=swapcup",
    "/icons/cocktail.png",
    true
  ),
  new FormButtonModel(
    "Carbonated Drinks",
    "product?id=swapcup",
    "/icons/soda-can.png",
    true
  ),
  new FormButtonModel(
    "Frozen Drinks",
    "product?id=swapcup",
    "/icons/smoothies.png",
    true
  ),
  new FormButtonModel(
    "Fruit Drinks",
    "product?id=swapcup",
    "/icons/juice.png",
    true
  ),
  new FormButtonModel("Dairy", "product?id=swapcup", "/icons/milk.png", true),
];

export const swapboxProduct: Product = new Product(
  "swapbox",
  ["1 L", "1.5 L"],
  ["Polypropylene", "Recycled Polypropylene"],
  "/images/swapbox_main.png"
);

export const swapcupProduct: Product = new Product(
  "swapcup",
  ["8 oz", "16 oz"],
  ["Polypropylene", "Recycled Polypropylene"],
  "/images/swapcup_main.png"
);

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

export function generateOptionsList(
  list: string[],
  selected: string[],
  setSelected: any,
  multipleChoice: boolean
) {
  return list.map((size) => (
    <FormOptionButton
      handleClick={() =>
        handleOptionClick(size, selected, setSelected, multipleChoice)
      }
      label={size}
      selected={selected.includes(size)}
    />
  ));
}

export const checkoutCipherAlgorithm = "aes256"; // or any other algorithm supported by OpenSSL
export const checkoutCipherKey = "walkedupheybuhbuhbuhgotanygrapes";
export const checkoutCipherIv = "ffa44bd444d0bde4";

export function generateCheckoutLink(checkoutString: string) {
  let cipher = createCipheriv(
    checkoutCipherAlgorithm,
    checkoutCipherKey,
    checkoutCipherIv
  );
  return cipher.update(checkoutString, "utf8", "hex") + cipher.final("hex");
}

const muuseOrder = [
  "Singapore^500^1 L",
  "Singapore^100^1.5 L",
  "Toronto^100^1 L",
  "Toronto^100^1.5 L",
  "Hong Kong^60^1 L",
].join("*");

const muuseCipher =
  "cac142c0c520b0fb2c45ff0dd168e9b74f8460d6a95082754328f00e5e91a6cc06f42bb3ac58c08e4135e55db2ea524bf6cacdbf37baae6cf844a2e880afc41d9200e4b026725fe5dcf529859adef0f4fe195b81e463864bec91f3a85dee35ee";
