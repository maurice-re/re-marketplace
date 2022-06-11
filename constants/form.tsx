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
