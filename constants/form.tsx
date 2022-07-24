import { createCipheriv } from "crypto";
import FormOptionButton from "../components/form/option-button";

export type FormButtonModel = {
  title: string;
  route: string;
  image?: string;
};

export enum Materials {
  RPP = "Recycled Polypropylene",
}

export const business_types: FormButtonModel[] = [
  { title: "Food", route: "types?id=food", image: "/icons/food.png" },

  { title: "Drinks", route: "types?id=drinks", image: "/icons/drinks.png" },
];

export const food_types: FormButtonModel[] = [
  { title: "Wet Food", route: "product?id=swapbox", image: "/icons/soup.png" },
  { title: "Dry Food", route: "product?id=swapbox", image: "/icons/salad.png" },
  {
    title: "Crispy Food",
    route: "product?id=swapbox",
    image: "/icons/fries.png",
  },
  {
    title: "Frozen Food",
    route: "product?id=swapbox",
    image: "/icons/frozen-food.png",
  },
];
export const drink_types: FormButtonModel[] = [
  {
    title: "Hot Drinks",
    route: "product?id=swapcup",
    image: "/icons/tea-cup.png",
  },
  {
    title: "Alcoholic Drinks",
    route: "product?id=swapcup",
    image: "/icons/cocktail.png",
  },
  {
    title: "Carbonated Drinks",
    route: "product?id=swapcup",
    image: "/icons/soda-can.png",
  },
  {
    title: "Frozen Drinks",
    route: "product?id=swapcup",
    image: "/icons/smoothies.png",
  },
  {
    title: "Fruit Drinks",
    route: "product?id=swapcup",
    image: "/icons/juice.png",
  },
  { title: "Dairy", route: "product?id=swapcup", image: "/icons/milk.png" },
];

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
      key={size}
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
  "Hong Kong^60^1 L",
].join("*");

const muuseCipher =
  "cac142c0c520b0fb2c45ff0dd168e9b74f8460d6a95082754328f00e5e91a6cc06f42bb3ac58c08e4135e55db2ea524bf6cacdbf37baae6cf844a2e880afc41d9200e4b026725fe5dcf529859adef0f4fe195b81e463864bec91f3a85dee35ee";
