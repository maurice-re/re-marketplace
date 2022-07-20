import { useRouter } from "next/router";
import { useState } from "react";
import { FormButtonModel } from "../../constants/form";
import { useFormState } from "../../context/form-context";
import FormCircleButton from "./circle-button";
import FormNextButton from "./next-button";

function FormButtonPage({
  items,
  oneToOne,
  pageName,
  title,
}: {
  items: FormButtonModel[];
  oneToOne: boolean;
  pageName: string;
  title: string;
}) {
  const [selected, setSelected] = useState<FormButtonModel[]>([]);
  const { activateRoute, deactivateRoute, getCity, locations } = useFormState();
  const router = useRouter();
  const { city } = router.query;

  console.log(selected);
  const shouldRemove = (item: FormButtonModel) => {
    if (oneToOne) {
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
        deactivateRoute(item.route, getCity(router.asPath).replace("%20", " "));
      }
      setSelected(selected.filter((val) => val != item));
    } else {
      activateRoute(item.route, getCity(router.asPath).replace("%20", " "));
      setSelected([...selected, item]);
    }
  }

  const listItems = items.map((item) => (
    <FormCircleButton
      handleClick={() => handleClick(item)}
      title={item.title}
      selected={selected.includes(item)}
      image={item.image}
      key={item.title}
    />
  ));

  const titleWidth: string = locations.length > 1 ? " w-144" : " w-124";
  const numColumns: string = items.length > 4 ? " columns-3" : " columns-2";

  return (
    <main className="flex flex-col container mx-auto items-center justify-evenly my-4">
      <div>
        <h1
          className={
            " text-5xl font-theinhardt text-white text-center" + titleWidth
          }
        >
          {locations.length > 1 ? title.split("?")[0] : title}
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
      <FormNextButton pageName={pageName} disabled={selected.length < 1} />
    </main>
  );
}

export default FormButtonPage;
