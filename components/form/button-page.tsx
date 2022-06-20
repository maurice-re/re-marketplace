import { useState } from "react";
import { useAppContext } from "../../context/context-provider";
import { FormButtonModel } from "../../models/form-button";
import styles from "../../styles/Form.module.css";
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
        context.removeRoute(item.route);
      }
      setSelected(selected.filter((val) => val != item));
    } else {
      context.addRoute(item.route);
      setSelected([...selected, item]);
    }
    setContext(context);
  }

  const listItems = items.map((item) => (
    <li className={styles.listItem} key={item.title}>
      <FormCircleButton
        handleClick={() => handleClick(item)}
        title={item.title}
        selected={selected.includes(item)}
        image={item.image}
        icon={item.icon}
      />
    </li>
  ));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.grid}>
        <ul className={styles.list}>{listItems}</ul>
      </div>
      <FormNextButton pageName={pageName} disabled={selected.length < 1} />
    </main>
  );
}

export default FormButtonPage;
