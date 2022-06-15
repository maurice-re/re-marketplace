import { FormButtonModel } from "../models/form-button";

export const business_types: FormButtonModel[] = [
  new FormButtonModel("Food", "food", "/icons/food.jpg"),
  new FormButtonModel("Drinks", "", "/icons/drinks.jpg"),
  new FormButtonModel("Groceries", "", "/icons/groceries.jpg"),
];

export const food_types: FormButtonModel[] = [
  new FormButtonModel("Salad", "container", "/icons/salad.png", true),
  new FormButtonModel(
    "Chicken Nuggets",
    "container",
    "/icons/nuggets.png",
    true
  ),
  new FormButtonModel("Rice", "container", "/icons/rice.png", true),
  new FormButtonModel("Pasta", "container", "/icons/spaguetti.png", true),
  new FormButtonModel("Burrito", "container", "/icons/burrito.png", true),
  new FormButtonModel("Sushi", "container", "/icons/sushi.png", true),
];
export const drink_types: FormButtonModel[] = [
  new FormButtonModel("Tea/Coffee", "cup", "/icons/tea-cup.png", true),
  new FormButtonModel("Cocktails", "cup", "/icons/cocktail.png", true),
  new FormButtonModel("Soda", "cup", "/icons/soda-can.png", true),
  new FormButtonModel("Smoothies", "cup", "/icons/smoothies.png", true),
  new FormButtonModel("Juice", "cup", "/icons/juice.png", true),
  new FormButtonModel("Beer", "cup", "/icons/beer.png", true),
];
