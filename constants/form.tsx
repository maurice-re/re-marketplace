import FormOptionButton from "../components/form/option-button";
import { FormButtonModel } from "../models/form-button";
import { Product } from "../models/products";
import styles from "../styles/Form.module.css";

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
    "/icons/steak.png",
    true
  ),
  // new FormButtonModel(
  //   "Snack Food",
  //   "product?id=swapbox",
  //   "/icons/burrito.png",
  //   true
  // ),
  // new FormButtonModel("Sushi", "product?id=swapbox", "/icons/sushi.png", true),
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
  "/images/takeout_vent.png"
);

export const swapcupProduct: Product = new Product(
  "swapcup",
  ["8 oz", "16 oz"],
  ["Polypropylene", "Recycled Polypropylene"],
  "/images/cup_dark.png"
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
    <li className={styles.listItem} key={size}>
      <FormOptionButton
        handleClick={() =>
          handleOptionClick(size, selected, setSelected, multipleChoice)
        }
        label={size}
        selected={selected.includes(size)}
      />
    </li>
  ));
}
