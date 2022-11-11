"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import FormCircleButton from "../../../components/form/circle-button";
import FormNextButton from "../../../components/form/next-button";
import ProgressBar from "../../../components/form/progress-bar";
import ReLogo from "../../../components/form/re-logo";
import {
  business_types,
  drink_types,
  food_types,
  FormButtonModel,
} from "../../../constants/form";
import { useFormStore } from "../../../stores/formStore";

export default function Page() {
  const [selected, setSelected] = useState<FormButtonModel[]>([]);
  const searchParams = useSearchParams();
  const path = usePathname();

  const id = searchParams.get("id");
  const city = searchParams.get("city");

  function getTypes(): FormButtonModel[] {
    if (id == "business") {
      return business_types;
    } else if (id == "food") {
      return food_types;
    }
    return drink_types;
  }

  function getTitle(): string {
    if (id == "business") {
      return "What types of products are you packaging?";
    } else if (id == "food") {
      return "What types of food are you packaging?";
    }
    return "What types of drinks are you packaging?";
  }

  const { activateRoute, deactivateRoute, locations } = useFormStore(
    (state) => ({
      activateRoute: state.activateRoute,
      deactivateRoute: state.deactivateRoute,
      locations: state.locations,
    })
  );

  const shouldRemove = (item: FormButtonModel): boolean => {
    if (id == "business") {
      return true;
    }

    const filteredRoutes = selected.filter((i) => i.route == item.route);
    if (filteredRoutes.length > 1) {
      return false;
    }
    return true;
  };

  function handleClick(item: FormButtonModel) {
    if (selected.includes(item)) {
      if (shouldRemove(item)) {
        deactivateRoute(
          item.route,
          searchParams.get("city")!.replace("+", " ")
        );
      }
      setSelected(selected.filter((val) => val != item));
    } else {
      activateRoute(item.route, searchParams.get("city")!.replace("+", " "));
      setSelected([...selected, item]);
    }
  }

  const listItems = getTypes().map((item) => (
    <FormCircleButton
      handleClick={() => handleClick(item)}
      title={item.title}
      selected={selected.includes(item)}
      image={item.image}
      key={item.title}
    />
  ));

  const titleWidth: string = locations.length > 1 ? " w-144" : " w-124";
  const numColumns: string =
    getTypes().length > 4 ? " columns-3" : " columns-2";

  return (
    <div className="w-screen h-screen bg-black flex">
      <ProgressBar pageName={path?.slice(1) + "?" + searchParams.toString()} />
      <ReLogo />
      <main className="flex flex-col container mx-auto items-center justify-evenly my-4">
        <div>
          <h1
            className={
              " text-5xl font-theinhardt text-white text-center" + titleWidth
            }
          >
            {locations.length > 1 ? getTitle().split("?")[0] : getTitle()}
            {locations.length > 1 && <span> in </span>}
            {locations.length > 1 && (
              <span className=" text-re-green-500">{city}</span>
            )}
            {locations.length > 1 && <span>?</span>}
          </h1>
          <div className="  text-sm italic self-right font-theinhardt text-white ml-6">
            Select all that apply
          </div>
        </div>
        <div className={"self-center" + numColumns}>{listItems}</div>
        <FormNextButton
          pageName={path?.slice(1) + "?" + searchParams.toString()}
          disabled={selected.length < 1}
        />
      </main>
    </div>
  );
}
