import { useFormStore } from "../../stores/formStore";

function ProgressBar({ pageName }: { pageName: string }) {
  const routes = useFormStore((state) => state.routes);
  const currentRouteIndex = routes.findIndex(
    (route) => route.name == pageName.replace("%20", " ")
  );
  return (
    <div
      className=" bg-re-blue h-3 absolute left-0 top-0"
      style={{
        width: `${((currentRouteIndex + 1) / routes.length) * 100}%`,
      }}
    ></div>
  );
}

export default ProgressBar;
