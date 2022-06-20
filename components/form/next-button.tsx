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
  const currentRouteIndex = context.routes.findIndex(
    (route) => route.name == pageName
  );

  const nextPage = context.nextRoute(currentRouteIndex);
  const label = (): string => {
    if (!option) {
      return "Next";
    } else {
      if (nextPage.includes("=")) {
        return `Next: ${nextPage.split("=")[1]}`;
      } else {
        return `Next: ${nextPage}`;
      }
    }
  };
  return (
    <div className={styles.nextContainer}>
      <Link href={nextPage}>
        <button
          className={option ? styles.nextOptionButton : styles.nextButton}
          type="button"
          disabled={disabled}
        >
          {label()}
        </button>
      </Link>
    </div>
  );
}

export default FormNextButton;
