import { useAppContext } from "../../context/context-provider";
import styles from "../../styles/Form.module.css";

function ProgressBar({ pageName }: { pageName: string }) {
  const [context, _] = useAppContext();
  const currentRouteIndex = context.routes.findIndex(
    (route) => route.name == pageName
  );
  return (
    <div
      className={styles.progressBar}
      style={{
        width: `${((currentRouteIndex + 1) / context.routes.length) * 100}%`,
      }}
    ></div>
  );
}

export default ProgressBar;
