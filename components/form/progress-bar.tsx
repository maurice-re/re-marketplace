import { useFormState } from "../../context/form-context";
import styles from "../../styles/Form.module.css";

function ProgressBar({ pageName }: { pageName: string }) {
  const { routes } = useFormState();
  const currentRouteIndex = routes.findIndex(
    (route) => route.name == pageName.replace("%20", " ")
  );

  console.log(routes);

  return (
    <div
      className={styles.progressBar}
      style={{
        width: `${((currentRouteIndex + 1) / routes.length) * 100}%`,
      }}
    ></div>
  );
}

export default ProgressBar;
