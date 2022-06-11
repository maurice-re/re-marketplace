import Link from "next/link";
import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

function FormNextButton({
  pageName,
  disabled,
  option,
}: {
  pageName: string;
  disabled: boolean;
  option?: boolean;
}) {
  const [context, _] = useAppContext();
  const currentRouteIndex = context.routes.indexOf(pageName);
  const lastRoute = option && currentRouteIndex == context.routes.length - 1;
  const optionLabel = lastRoute
    ? "summary"
    : context.routes[currentRouteIndex + 1];

  const nextPage = lastRoute
    ? "summary"
    : context.routes[currentRouteIndex + 1] ?? "";
  return (
    <div className={styles.nextContainer}>
      <Link href={nextPage}>
        <button
          className={option ? styles.nextOptionButton : styles.nextButton}
          type="button"
          disabled={disabled}
        >
          {option ? "Next: " + optionLabel : "Next"}
        </button>
      </Link>
    </div>
  );
}

export default FormNextButton;
