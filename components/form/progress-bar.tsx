import { useAppContext } from "../../context/context-provider";

function ProgressBar({ pageName }: { pageName: string }) {
  const [context, _] = useAppContext();
  const currentRouteIndex = context.routes.findIndex(
    (route) => route.name == pageName.replace("%20", " ")
  );
  return (
    <div
      className=" bg-re-blue h-3 absolute left-0 top-0"
      style={{
        width: `${((currentRouteIndex + 1) / context.routes.length) * 100}%`,
      }}
    ></div>
  );
}

export default ProgressBar;
