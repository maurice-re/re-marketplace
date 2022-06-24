import Link from "next/link";
import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

function FormNextButton({
  onClick,
  pageName,
  disabled,
  option,
}: {
  onClick?: () => void;
  pageName: string;
  disabled: boolean;
  option?: boolean;
}) {
  const [context, _] = useAppContext();
  const currentRouteIndex = context.routes.findIndex(
    (route) => route.name == pageName.replace("%20", " ")
  );

  const nextPage = context.nextRoute(currentRouteIndex);
  const label = (): string => {
    if (!option) {
      return "Next";
    } else {
      if (nextPage.includes("=")) {
        if (nextPage.includes("business")) {
          return `Next: ${nextPage.split("=")[2]}`;
        }
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
          onClick={onClick}
        >
          {label()}
        </button>
      </Link>
    </div>
  );
}

export default FormNextButton;
