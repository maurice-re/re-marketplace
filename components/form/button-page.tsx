import { useRouter } from "next/router";
import { useState } from "react";
import { useAppContext } from "../../context/context-provider";
import { FormButtonModel } from "../../models/form-button";
import { FormState } from "../../models/form-state";
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
  const [context, setContext] = useAppContext();
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
  console.log(context.routes);

  function handleClick(item: FormButtonModel) {
    if (selected.includes(item)) {
      if (shouldRemove(item)) {
        context.removeRoute(
          item.route,
          FormState.getCity(router.asPath).replace("%20", " ")
        );
      }
      setSelected(selected.filter((val) => val != item));
    } else {
      context.addRoute(
        item.route,
        FormState.getCity(router.asPath).replace("%20", " ")
      );
      setSelected([...selected, item]);
    }
    setContext(context);
  }

  const listItems = items.map((item) => (
    <FormCircleButton
      handleClick={() => handleClick(item)}
      title={item.title}
      selected={selected.includes(item)}
      image={item.image}
      icon={item.icon}
    />
  ));

  const titleWidth: string = context.locations.length > 1 ? " w-144" : " w-124";

  return (
    <main className="flex flex-col container mx-auto items-center justify-evenly my-4">
      <div>
        <h1
          className={
            " text-5xl font-theinhardt text-white text-center" + titleWidth
          }
        >
          {title}
          {context.locations.length > 1 && <span> in </span>}
          {context.locations.length > 1 && (
            <span className=" text-re-green-500">{city}</span>
          )}
        </h1>
        <div className="  text-sm italic self-right font-theinhardt text-white ml-6">
          Select all that apply
        </div>
      </div>
      <div className="self-center columns-2">{listItems}</div>
      <FormNextButton pageName={pageName} disabled={selected.length < 1} />
    </main>
  );
}

export default FormButtonPage;
